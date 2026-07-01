import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import React, { useEffect } from 'react'

import { getBaseCompletionItems, initializeFleeSpec } from './language-spec'

interface IEditorSuggestion {
  label: string | undefined
  insertText: string | undefined
  // kind: ReturnType<typeof useMonaco>['languages']['CompletionItemKind']
}

interface IFormulaEditorProps {
  value?: string
  onChange?: (value: string) => void
  suggestions?: IEditorSuggestion[]
  setIsFormulaEditorFocused?: (flag: boolean) => void
  readOnly?: boolean
  canWrite?: boolean
}

export const FormulaEditor: React.FC<IFormulaEditorProps> = ({
  value,
  suggestions,
  onChange,
  setIsFormulaEditorFocused,
  readOnly,
  canWrite,
}) => {
  const monaco = useMonaco()
  const [suggestionProvider, setSuggestionProvider] = React.useState<any>(null)

  useEffect(() => {
    if (!monaco || !suggestions) return

    monaco.editor.getEditors()[0]?.onDidFocusEditorWidget(() => {
      setIsFormulaEditorFocused?.(true)
    })

    monaco.editor.getEditors()[0]?.onDidBlurEditorWidget(() => {
      setIsFormulaEditorFocused?.(false)
    })

    if (suggestionProvider) {
      suggestionProvider.dispose()
    }

    const provider = monaco.languages.registerCompletionItemProvider('flee', {
      provideCompletionItems: (model, position) => ({
        // @ts-ignore
        suggestions: [...getBaseCompletionItems(monaco, model, position), ...suggestions].map((s) => ({
          label: s.label,
          // kind: s.kind,
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: s.insertText,
          // range: new monaco.Range(position.lineNumber, position.column - 1, position.lineNumber, position.column),
        })),
      }),
    })

    setSuggestionProvider(provider)
  }, [monaco, suggestions])

  return (
    <MonacoEditor
      value={value}
      height='13vh'
      theme='fleeTheme'
      defaultLanguage='flee'
      onChange={onChange}
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        padding: { bottom: 30, top: 30 },
        wordBasedSuggestions: false,
        fontSize: 15,
        readOnly: readOnly || !canWrite,
      }}
      beforeMount={(monaco) => {
        initializeFleeSpec({ monaco })
      }}
    />
  )
}
