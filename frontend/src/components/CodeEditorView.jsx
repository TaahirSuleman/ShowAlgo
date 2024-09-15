/**
 * Author(s): Yusuf Kathrada, Gregory Maselle
 * Date: September 2024
 * Description: This file contains a CodeEditorView component
 */

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
  indexState,
}) => {
  // state variables
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [decorations, setDecorations] = useState([]);

  const monaco = useMonaco();

  // Check if Monaco has been initialized to ensure the language is only registered once
  useEffect(() => {
    if (
      monaco &&
      !monaco.languages
        .getLanguages()
        .some((lang) => lang.id === "customLanguage")
    ) {
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
            foreground: "C678DD", // Purple
          },
          {
            token: "keyword.control",
            foreground: "E06C75", // Soft red
          },
          {
            token: "keyword.methods",
            foreground: "61AFEF", // Light blue
          },
          {
            token: "type",
            foreground: "E5C07B", // Warm yellow
          },
          {
            token: "keyword.boolean",
            foreground: "D19A66", // Warm orange
          },
          {
            token: "keyword.operator",
            foreground: "56B6C2", // Light green
          },
          {
            token: "keyword.function",
            foreground: "61AFEF", // Light blue
          },
          {
            token: "string",
            foreground: "98C379", // Green color
          },
          { token: "comment", foreground: "808080", fontStyle: "italic" },
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

  // This works similar to visualisation components. Line highlighting proceeds to the relevant line as the objects are processed.
  // This gives an implicit way of synchronising line highlighting with the visualisation view.
  useEffect(() => {
    const performOperations = () => {
    if (
      movementsState && // Check if movementsState is defined
      indexState < movementsState.length &&
      indexState > -1 &&
      !pauseState &&
      editor
    ) {
      let lineNo = movementsState[indexState].line;
      if (lineNo !== null) { // lineNo can be null in instances where a movement object does not warrant a line highlight (end if, for example)
        // Set the decoration of the target line AKA highlight the relevent line
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
      // clear the highlights from the code editor
    } else if (!highlightState && editor) {
      clearHighlights(editor);
    }
    };
    performOperations();
  }, [indexState, highlightState, pauseState]);

  // Set a timer to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Set the editor instance
  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  const clearHighlights = (editor) => {
    setDecorations((oldDecorations) =>
      editor.deltaDecorations(oldDecorations, [])
    );
  };

  // Loading component to display while the editor is loading
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
      {/* Display the loading component while the editor is loading */}
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
