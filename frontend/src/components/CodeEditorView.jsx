import { Box, Fade, Spinner } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useState, useRef } from "react";
import { keywords, getSuggestions } from "../utils/SPLconfig";

const CodeEditorView = ({
  language,
  value,
  setValue,
  defaultValue,
  height,
  width,
  movementsState,
  highlightState,
  pauseState,
  indexState
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const monaco = useMonaco();
  const timerRefs = useRef([]); // Ref to store timeout IDs

  useEffect(() => {
    if (monaco && !monaco.languages.getLanguages().some(lang => lang.id === 'customLanguage')) {
      // Register and define your custom language
      monaco.languages.register({ id: "customLanguage" });

      monaco.languages.setMonarchTokensProvider("customLanguage", {
        tokenizer: {
          root: keywords,
        },
      });

      monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          {
            token: "keyword",
            foreground: "C678DD", // Purple, commonly used for keywords in One Dark Pro
          },
          {
            token: "keyword.control",
            foreground: "E06C75", // A soft red, often used for control structures
          },
          {
            token: "keyword.methods",
            foreground: "61AFEF", // A light blue for method names
          },
          {
            token: "type",
            foreground: "E5C07B", // A warm yellow, often used for types and classes
          },
          {
            token: "keyword.boolean",
            foreground: "D19A66", // A warm orange for boolean values
          },
          {
            token: "keyword.operator",
            foreground: "56B6C2",
          },
          {
            token: "keyword.function",
            foreground: "61AFEF",
          },
          {
            token: "string",
            foreground: "98C379", // A green color for strings, typical in One Dark Pro
          },

          // { token: "comment", foreground: "808080", fontStyle: "italic" },
        ],
        colors: {
          "editor.foreground": "#FFFFFF",
          "editor.background": "#0000004C",
          "editor.lineHighlightBorder": "#00000000",
          "editor.lineHighlightBackground": "#0000001C",
        },
      });

      // Register the autocomplete provider
      monaco.languages.registerCompletionItemProvider("customLanguage", {
        provideCompletionItems: () => {
          return { suggestions: getSuggestions(monaco) };
        },
      });
    }
  }, [monaco]);

  useEffect(()=>{
    if (indexState < movementsState.length && indexState > -1 && !pauseState && editor){
      console.log("The highlight state: "+highlightState)
      let lineNo = movementsState[indexState].line;
      if (lineNo !== null){
        setDecorations((oldDecorations) =>
          editor.deltaDecorations(oldDecorations, [
            {
              range: new monaco.Range(lineNo, 1, lineNo, 1),
              options: {
                isWholeLine: true,
                className: "myLineHighlight",
              },
            },
          ])
        );
        editor.revealLine(lineNo);
      }
    }
    else if (!highlightState && editor){
      clearHighlights(editor)
    }
  }, [indexState, highlightState])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  // Clear all active timers
  const clearTimers = () => {
    timerRefs.current.forEach((id) => clearTimeout(id));
    timerRefs.current = [];
  };

  const clearHighlights = (editor) => {
    setDecorations((oldDecorations) =>
      editor.deltaDecorations(oldDecorations, [])
    );
  };

  const loadingComponent = (
    <Box
      display="flex"
      bg="blackAlpha.600"
      height={height}
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Spinner thickness="6px" speed="0.50s" color="purple.400" size="xl" />
    </Box>
  );

  return (
    <Box overflow="hidden">
      {isLoading ? (
        loadingComponent
      ) : (
        <Fade in={!isLoading}>
          <Editor
            height={height}
            width={width}
            theme="myCustomTheme"
            language="customLanguage"
            defaultValue={defaultValue}
            value={value}
            onChange={(value) => setValue(value)}
            loading={loadingComponent}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              wrappingIndent: "same",
              scrollbar: { vertical: "auto", horizontal: "auto" },
            }}
            onMount={handleEditorDidMount}
          />
        </Fade>
      )}
    </Box>
  );
};

export default CodeEditorView;
