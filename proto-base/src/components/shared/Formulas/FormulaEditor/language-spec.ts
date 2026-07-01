import type { useMonaco } from '@monaco-editor/react'

interface IProps {
  monaco: ReturnType<typeof useMonaco>
}

export const initializeFleeSpec = ({ monaco }: IProps) => {
  // Register a new language
  monaco.languages.register({ id: 'flee' })

  // Register a tokens provider for FLEE language
  monaco.languages.setMonarchTokensProvider('flee', {
    tokenizer: {
      root: [
        // comments
        [/#.*$/, 'comment'],
        [/DELETED_VARIABLE/, 'deleted-variable'],
        [/Sum|Min|Max|Average|If/, 'flee-keyword'],
        [/true|false/, 'boolean'],
        [/[+\-]?\d+(\.\d+)?/, 'number'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/[a-zA-Z_]\w*/, 'identifier'],
        [/\+\+|--|&&|\|\||[=!<>+\-*/%]/, 'operator'],
      ],
    },
  })

  // Define a theme for FLEE
  monaco.editor.defineTheme('fleeTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'boolean', foreground: '00FFFF' },
      { token: 'number', foreground: '1099e8' },
      { token: 'string', foreground: 'A31515' },
      { token: 'identifier', foreground: 'ffffff', fontStyle: 'italic' },
      { token: 'operator', foreground: '9d58ed' },
      { token: 'flee-keyword', foreground: '00FFFF' },
      { token: 'deleted-variable', foreground: 'FF0000' },
      { token: 'comment', foreground: '00FF00' },
    ],
    colors: {},
  })
}

export const getBaseCompletionItems = (monaco, model, position) => {
  var word = model.getWordUntilPosition(position)
  var range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  }
  return []
}
