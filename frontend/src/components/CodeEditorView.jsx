import { Box, Center, Spinner } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const CodeEditorView = ({
  language,
  value,
  onMount,
  setValue,
  defaultValue,
  height,
  width,
}) => {
  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // whether to inherit the base theme's rules

        rules: [
          { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
          { token: 'keyword', foreground: 'ff0000', fontStyle: 'bold' },

        ],
        colors: {
          'editor.foreground': '#FFFFFF',
          'editor.background': '#0000004C',
          'editor.lineHighlightBorder': '#00000000',
          'editor.lineHighlightBackground': '#0000001C',
          // variable color
          

        }
      });
    }
  }, [monaco]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const loadingComponent = (
    <Box display="flex" bg="blackAlpha.700" width="50dvw" height="50dvh" justifyContent="center" alignItems="center">
      <Spinner
        thickness="6px"
        speed="0.50s"
        color="purple.400"
        size="xl"

      />
    </Box>
  );

  return (
    <Box borderRadius={4} overflow="hidden">
      {isLoading ? (
        loadingComponent
      ) : (
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
        />
      )}
    </Box>
  );
};

export default CodeEditorView;
