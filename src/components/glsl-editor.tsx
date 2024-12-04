import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { shader } from "@codemirror/legacy-modes/mode/clike";
import { themes } from "@/lib/constants";
import {
  autocompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";

function extractVariables(code: string) {
  const variables: Array<{ name: string; type: string }> = [];

  // Match variable declarations like: "float foo;" or "vec2 position;"
  const variableRegex =
    /\b(void|float|int|bool|vec[234]|mat[234]|sampler2D)\s+([a-zA-Z_]\w*)\s*;/g;

  // Match uniform declarations
  const uniformRegex =
    /\buniform\s+(float|int|bool|vec[234]|mat[234]|sampler2D)\s+([a-zA-Z_]\w*)\s*;/g;

  // Match varying declarations
  const varyingRegex =
    /\bvarying\s+(float|int|bool|vec[234]|mat[234])\s+([a-zA-Z_]\w*)\s*;/g;

  // Match attribute declarations
  const attributeRegex =
    /\battribute\s+(float|int|bool|vec[234]|mat[234])\s+([a-zA-Z_]\w*)\s*;/g;

  // Function to process matches
  function processMatches(regex: RegExp, prefix: string = "") {
    let match;
    while ((match = regex.exec(code)) !== null) {
      variables.push({
        name: match[2],
        type: `${prefix}${match[1]}`,
      });
    }
  }

  // Process all types of declarations
  processMatches(variableRegex);
  processMatches(uniformRegex, "uniform ");
  processMatches(varyingRegex, "varying ");
  processMatches(attributeRegex, "attribute ");

  return variables;
}

// prettier-ignore
const glslKeywords = [
  "void", "float", "int", "bool", "vec2", "vec3", "vec4", "mat2", "mat3", "mat4",
  "uniform", "attribute", "varying", "const", "in", "out", "inout", "sampler2D",
  "if", "else", "for", "while", "do", "break", "continue", "return", "struct",
  "discard", "lowp", "mediump", "highp", "precision", "invariant"
];

// prettier-ignore
const glslFunctions = [
  "abs", "acos", "asin", "atan", "atan2", "ceil", "clamp", "cos", "cosh", "cross", "degrees",
  "determinant", "distance", "dot", "equal", "exp", "exp2", "faceforward", "floor", "fract",
  "greaterThan", "greaterThanEqual", "inversesqrt", "length", "lessThan", "lessThanEqual",
  "log", "log2", "matrixCompMult", "max", "min", "mix", "mod", "normalize", "not", "notEqual",
  "outerProduct", "pow", "radians", "reflect", "refract", "round", "roundEven", "sign", "sin",
  "sinh", "smoothstep", "sqrt", "step", "tan", "tanh", "transpose", "trunc"
];

function glslCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (!word) return null;

  const doc = context.state.doc.toString();
  const variables = extractVariables(doc);
  const variableDeclarationRegex =
    /\b(float|int|bool|vec[234]|mat[234])\s+([a-zA-Z_]\w*)\s*=/g;

  let match;
  while ((match = variableDeclarationRegex.exec(doc)) !== null) {
    variables.push({
      name: match[2],
      type: match[1],
    });
  }

  const completions = [
    ...glslKeywords.map((keyword) => ({
      label: keyword,
      type: "keyword",
      detail: "GLSL keyword",
    })),
    ...glslFunctions.map((func) => ({
      label: func,
      type: "function",
      detail: "GLSL function",
    })),
    ...variables.map((variable) => ({
      label: variable.name,
      type: "variable",
      detail: variable.type,
      boost: 2, // Prioritize local variables in suggestions
    })),
  ];

  return {
    from: word.from,
    options: completions,
    validFor: /^\w*$/,
  };
}

interface GLSLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  theme: keyof typeof themes;
  tabSize: 2 | 4;
  fontSize: number;
}

export const GLSLEditor: React.FC<GLSLEditorProps> = ({
  value,
  onChange,
  theme,
  tabSize,
  fontSize,
}) => {
  return (
    <CodeMirror
      className="absolute inset-0"
      style={{ fontSize: `${fontSize}px` }}
      value={value}
      height="100%"
      theme={themes[theme]}
      extensions={[
        StreamLanguage.define(shader),
        autocompletion({ override: [glslCompletions] }),
      ]}
      onChange={onChange}
      basicSetup={{
        tabSize,
        lineNumbers: true,
        highlightActiveLine: true,
        autocompletion: true,
        highlightSelectionMatches: true,
        highlightActiveLineGutter: true,
      }}
    />
  );
};
