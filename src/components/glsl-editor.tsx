import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { shader } from "@codemirror/legacy-modes/mode/clike";
import { themes } from "@/lib/constants";
import {
  autocompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import { useData } from "@/store/data";
import { useConfig } from "@/store/config";
import { useEffect } from "react";

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
  "sinh", "smoothstep", "sqrt", "step", "tan", "tanh", "transpose", "trunc", "texture2D", "texture"
];

const exceptSymbols = [";", "(", ")", "{", "}", "[", "]", ",", "."];

function glslCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (
    !word ||
    exceptSymbols.includes(
      context.state.doc.sliceString(word.from - 1, word.from)
    )
  ) {
    return null;
  }

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

// eslint-disable-next-line react-refresh/only-export-components
export const formatCode = (fileType: "vertex" | "fragment") => {
  const vertexShader = useData.getState().current.vertexShader;
  const fragmentShader = useData.getState().current.fragmentShader;
  const updateVertexShader = useData.getState().updateVertexShader;
  const updateFragmentShader = useData.getState().updateFragmentShader;
  const tabSize = useConfig.getState().tabSize;
  const code = fileType === "vertex" ? vertexShader : fragmentShader;
  const update =
    fileType === "vertex" ? updateVertexShader : updateFragmentShader;

  const lines = code.split("\n").map((line) => line.trim());
  let indentLevel = 0;

  // Filter out consecutive empty lines
  const filteredLines: string[] = [];
  let lastLineEmpty = false;

  lines.forEach((line) => {
    const isEmpty = line.length === 0;
    if (!(isEmpty && lastLineEmpty)) {
      filteredLines.push(line);
    }
    lastLineEmpty = isEmpty;
  });

  const formattedLines = filteredLines.map((line) => {
    if (line.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
    const indented = " ".repeat(indentLevel * tabSize) + line;
    if (line.endsWith("{")) indentLevel++;
    return indented;
  });

  const formatted = formattedLines.join("\n");
  if (formatted !== code) update(formatted);
};

interface GLSLEditorProps {
  fileType: "vertex" | "fragment";
}

export const GLSLEditor: React.FC<GLSLEditorProps> = ({ fileType }) => {
  const vertexShader = useData((state) => state.current.vertexShader);
  const fragmentShader = useData((state) => state.current.fragmentShader);
  const updateVertexShader = useData((state) => state.updateVertexShader);
  const updateFragmentShader = useData((state) => state.updateFragmentShader);
  const theme = useConfig((state) => state.theme);
  const tabSize = useConfig((state) => state.tabSize);
  const fontSize = useConfig((state) => state.fontSize);

  useEffect(() => {
    formatCode(fileType);
  }, [tabSize, fileType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        formatCode(fileType);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fileType]);

  return (
    <CodeMirror
      className="absolute inset-0"
      style={{ fontSize: `${fontSize}px` }}
      value={fileType === "vertex" ? vertexShader : fragmentShader}
      height="100%"
      theme={themes[theme]}
      extensions={[
        StreamLanguage.define(shader),
        autocompletion({ override: [glslCompletions] }),
      ]}
      onChange={
        fileType === "vertex" ? updateVertexShader : updateFragmentShader
      }
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
