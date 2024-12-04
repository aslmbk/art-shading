import {
  defaultSettingsVscodeDark,
  defaultSettingsVscodeLight,
  vscodeDark,
  vscodeLight,
} from "@uiw/codemirror-theme-vscode";
import { defaultSettingsDracula, dracula } from "@uiw/codemirror-theme-dracula";
import {
  defaultSettingsGithubDark,
  defaultSettingsGithubLight,
  githubDark,
  githubLight,
} from "@uiw/codemirror-theme-github";
import {
  material,
  materialDark,
  materialLight,
  defaultSettingsMaterial,
  defaultSettingsMaterialDark,
  defaultSettingsMaterialLight,
} from "@uiw/codemirror-theme-material";
import { defaultSettingsOkaidia, okaidia } from "@uiw/codemirror-theme-okaidia";
import { atomone, defaultSettingsAtomone } from "@uiw/codemirror-theme-atomone";
import {
  androidstudio,
  defaultSettingsAndroidstudio,
} from "@uiw/codemirror-theme-androidstudio";
import { defaultSettingsMonokai, monokai } from "@uiw/codemirror-theme-monokai";
import {
  andromeda,
  defaultSettingsAndromeda,
} from "@uiw/codemirror-theme-andromeda";
import {
  defaultSettingsXcodeDark,
  defaultSettingsXcodeLight,
  xcodeDark,
  xcodeLight,
} from "@uiw/codemirror-theme-xcode";
import { type Settings } from "@uiw/codemirror-themes";

export const themes = {
  xcodeDark,
  xcodeLight,
  vscodeDark,
  vscodeLight,
  dracula,
  githubDark,
  githubLight,
  material,
  materialDark,
  materialLight,
  okaidia,
  atomone,
  androidstudio,
  monokai,
  andromeda,
};

export const themesSettings: Record<keyof typeof themes, Settings> = {
  xcodeDark: defaultSettingsXcodeDark,
  xcodeLight: defaultSettingsXcodeLight,
  andromeda: defaultSettingsAndromeda,
  vscodeDark: defaultSettingsVscodeDark,
  vscodeLight: defaultSettingsVscodeLight,
  dracula: defaultSettingsDracula,
  githubDark: defaultSettingsGithubDark,
  githubLight: defaultSettingsGithubLight,
  material: defaultSettingsMaterial,
  materialDark: defaultSettingsMaterialDark,
  materialLight: defaultSettingsMaterialLight,
  okaidia: defaultSettingsOkaidia,
  atomone: defaultSettingsAtomone,
  androidstudio: defaultSettingsAndroidstudio,
  monokai: defaultSettingsMonokai,
};

export const codeSnippets = [
  "uniform float uTime;",
  "uniform vec2 uResolution;",
  "uniform vec2 uMouse;",
  "uniform sampler2D uTexture1;",
  "uniform sampler2D uTexture2;",
  "uniform sampler2D uTexture3;",
  "uniform sampler2D uTexture4;",
];
