const caxa = require('caxa').default;

(async () => {
    await caxa({
        input: ".",
        output: "executable/OTBfO.exe",
        command: [
            "{{caxa}}/node_modules/.bin/node",
            "{{caxa}}/index.js",
            "--trace-uncaught"
        ],
        exclude: [
            "**/executable/**",
            "**/config/**",
            "*.md",
            ".*",
            "eslintrc.json"
        ]
    });
})();