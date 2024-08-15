import { Box, Spinner } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useState, useRef } from "react";

const CodeEditorView = ({
  language,
  value,
  setValue,
  defaultValue,
  height,
  width,
  speedState,
  movementsState,
  highlightState,
  setHighlightState,
  pauseState,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const monaco = useMonaco();
  const timerRefs = useRef([]); // Ref to store timeout IDs
  const currentLineIndex = useRef(0); // Ref to store the current line index being highlighted
  const currentSpeed = useRef(speedState); // Ref to track the current speed state for ongoing highlights

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "ffa500", fontStyle: "italic underline" },
          { token: "keyword", foreground: "ff0000", fontStyle: "bold" },
        ],
        colors: {
          "editor.foreground": "#FFFFFF",
          "editor.background": "#0000004C",
          "editor.lineHighlightBorder": "#00000000",
          "editor.lineHighlightBackground": "#0000001C",
        },
      });
    }
  }, [monaco]);

  useEffect(() => {
    if (editor) {
      if (highlightState && !pauseState) {
        // Begin or continue highlighting
        startHighlighting();
      } else {
        // Pause or clear highlights
        clearTimers(); // Clear ongoing timers
        if (!highlightState) {
          clearHighlights(editor); // Clear decorations if highlightState is false
          currentLineIndex.current = 0; // Reset current line index if highlightState is false
        }
      }
    }
  }, [highlightState, pauseState, editor]); // Removed speedState from dependencies

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
    setDecorations((oldDecorations) => editor.deltaDecorations(oldDecorations, []));
  };

  // Start highlighting lines with speed and pause control
  const startHighlighting = () => {
    clearTimers(); // Clear existing timers before starting new ones

    const highlightNextLine = () => {
      if (currentLineIndex.current < movementsState.length && !pauseState) {
        const { line } = movementsState[currentLineIndex.current];
        setDecorations((oldDecorations) =>
          editor.deltaDecorations(oldDecorations, [
            {
              range: new monaco.Range(line, 1, line, 1),
              options: {
                isWholeLine: true,
                className: "myLineHighlight",
              },
            },
          ])
        );

        currentLineIndex.current += 1; // Move to the next line

        if (currentLineIndex.current < movementsState.length) {
          const delay = currentSpeed.current * 1000; // Use current speed for all subsequent lines
          const timerId = setTimeout(highlightNextLine, delay);
          timerRefs.current.push(timerId);
        }
      }
    };

    // Start highlighting from the current position
    highlightNextLine();
  };

  // Update current speed when speedState changes
  useEffect(() => {
    currentSpeed.current = speedState; // Update the ref to reflect the new speedState
  }, [speedState]);

  const loadingComponent = (
    <Box display="flex" bg="blackAlpha.700" height={height} justifyContent="center" alignItems="center">
      <Spinner
        thickness="6px"
        speed="0.50s"
        color="purple.400"
        size="xl"

      />
    </Box>
  );

  return (
    <Box overflow="hidden">
      {isLoading ? (
        loadingComponent
      ) : (
        <>
        <Editor
          height={height}
          width={width}
          theme="myCustomTheme"
          language={language}
          defaultValue={defaultValue}
          value={value}
          onChange={(value) => setValue(value)}
          loading={loadingComponent}
          options={
            {
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
        </>
      )}
    </Box>
  );
};

export default CodeEditorView;
