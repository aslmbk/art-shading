import React from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

type Monaco = typeof monaco;

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  scrollBeyondLastLine: false,
  roundedSelection: false,
  padding: { top: 10 },
  lineNumbers: "on",
  glyphMargin: false,
  folding: true,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 3,
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
  },
};

const glslLanguageConfig = {
  keywords: [
    "attribute",
    "const",
    "uniform",
    "varying",
    "break",
    "continue",
    "do",
    "for",
    "while",
    "if",
    "else",
    "in",
    "out",
    "inout",
    "float",
    "int",
    "void",
    "bool",
    "true",
    "false",
    "vec2",
    "vec3",
    "vec4",
    "ivec2",
    "ivec3",
    "ivec4",
    "mat2",
    "mat3",
    "mat4",
    "sampler2D",
    "samplerCube",
    "return",
  ],
  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
  ],
  symbols: /[=><!~?:&|+\-*/^%]+/,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
      [/[{}()[\]]/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "",
          },
        },
      ],
      [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      [/\/\/.*$/, "comment"],
      [/[/*]/, "comment"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
  },
};

const beforeMount = (monaco: Monaco) => {
  // Register GLSL language
  monaco.languages.register({ id: "glsl" });
  monaco.languages.setMonarchTokensProvider(
    "glsl",
    glslLanguageConfig as monaco.languages.IMonarchLanguage
  );
};

interface GLSLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export const GLSLEditor: React.FC<GLSLEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      defaultLanguage="glsl"
      value={value}
      onChange={onChange}
      options={
        editorOptions as monaco.editor.IStandaloneEditorConstructionOptions
      }
      beforeMount={beforeMount}
      theme="vs-dark"
    />
  );
};
