const PREFIX = `\0magento2:`;

const magento2 = opts => {
  const options = Object.assign({virtual: []}, opts);
  const importDcl = {};

  const formatOutput = (src, start, end) => {
    const keys = Object.keys(importDcl).filter(k => opts.virtual.includes(k));
    const deps = keys.map(m => `'${m}'`);
    const args = keys.map(k => importDcl[k].default || k).join(',');
    const expr = `function(${args}) ${src.slice(start, end)}`;
    return `define([${deps.join(', ')}], ${expr});`;
  };

  const buildVirtualModule = id => {
    const defaultName = importDcl[id].default || id;
    const defaultExport = `export default ${defaultName}`;
    const identifiers = importDcl[id].identifiers;
    const exports = identifiers.map(imported => {
      return `export var ${imported} = ${defaultName}.${imported};`;
    });
    return exports + defaultExport;
  };

  const buildImportDecl = () => {
    return {
      default: false,
      identifiers: []
    };
  };

  return {
    name: 'magento2',

    resolveId (id, importer) {
      if (options.virtual.includes(id)) {
        return PREFIX + id;
      }
    },

    load (id) {
      if (id.startsWith(PREFIX)) {
				id = id.slice(PREFIX.length);
        return buildVirtualModule(id);
			}
    },

    renderChunk (code, chunk, outputOptions) {
      const ast = this.parse(code);

      if (ast.body.length == 1) {
        let body = ast.body[0];

        if (body.type == 'ExpressionStatement') {
          const expression = body.expression;
          const funcExpression = expression.callee;
          return formatOutput(code, funcExpression.body.start, funcExpression.body.end);
        } else if (body.type == 'VariableDeclaration') {
          const declaration = body.declarations[0];
          const funcExpression = declaration.init.callee;
          return formatOutput(code, funcExpression.body.start, funcExpression.body.end);
        }
      }
    },

    transform (code, id) {
      if (id.startsWith(PREFIX)) {
        return;
			}

      const ast = this.parse(code);

      // Extract all imports
      for (const idx in ast.body) {
        const node = ast.body[idx];
        if (node.type == 'ImportDeclaration') {
          const source = node.source.value;

          // Ignore if not listed as virtual
          if (!options.virtual.includes(source)) {
            continue;
          }

          const specifier = node.specifiers[0];

          if (specifier.type == 'ImportDefaultSpecifier') {
            const name = specifier.local.name;
            importDcl[source] = importDcl[source] || buildImportDecl();
            importDcl[source].default = name;
          } else {
            const imported = specifier.imported;
            importDcl[source] = importDcl[source] || buildImportDecl();
            importDcl[source].identifiers.push(imported.name);
          }
        }
      }
    }
  };
};

export default magento2;
