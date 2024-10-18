import React, { useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  SelectionState,
  Modifier,
} from "draft-js";

import clsx from "clsx";
import "../../styles/customEditor.css";
import EditorControl from "./EditorControl";
import {
  CONTROL_TYPE,
  CUSTOM_ENTITY,
  EDITOR_CONTROLS,
  isLink,
} from "./constant";
import { useEffect } from "react";
import { Trash } from "phosphor-react";

export default function CustomEditor({
  label,
  placeholder = "Enter a description",
  minHeight,
  isRequired = false,
  defaultValue,
}) {
  const linkDecorator = {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === CUSTOM_ENTITY.LINK
        );
      }, callback);
    },
    component: ({ contentState, entityKey, children }) => {
      const { url, target = "_blank" } = contentState
        .getEntity(entityKey)
        .getData();

      if (!isLink(url)) return url;

      return (
        <a href={url} target={target} className="text-blue-500 underline">
          {children}
        </a>
      );
    },
  };
  const decorator = new CompositeDecorator([linkDecorator]);
  const initialState = defaultValue
    ? () =>
        EditorState.moveFocusToEnd(
          EditorState.createWithContent(convertFromRaw(defaultValue), decorator)
        )
    : () => EditorState.createEmpty(decorator);
  const [editorState, setEditorState] = useState(initialState);
  const [editorError, setEditorError] = useState("");

  const editorRef = useRef(null);

  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "unordered-list-item":
        return "list-disc ml-5";
      case "ordered-list-item":
        return "list-decimal ml-5";
      case "blockquote":
        return "border-l-4 border-primary-300 py-1.5 px-4 my-2";
      case "code-block":
        return "bg-primary-300 text-white p-4 rounded";
      default:
        return null;
    }
  };

  const handleSave = () => {
    console.log({ editorStateeditorStateeditorState: editorState });
    console.log({
      convertToRaw: convertToRaw(editorState.getCurrentContent()),
    });
  };

  const handleRemoveCustomBlock = ({ block, contentState }) => {
    const blockKey = block.getKey();

    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
    });
    contentState = Modifier.setBlockType(contentState, targetRange, "unstyled");
    contentState = Modifier.removeRange(contentState, targetRange, "forward");

    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "remove-range"
    );
    setEditorState(newEditorState);
  };

  const renderEntity = ({ entityType, entityData }) => {
    switch (entityType) {
      case CUSTOM_ENTITY.EMBED:
        return (
          <div className="flex items-end">
            <iframe
              src={entityData.src}
              allowFullScreen
              className="w-[300px] aspect-video"
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          </div>
        );
      case CUSTOM_ENTITY.IMAGE:
        return <img src={entityData.src} className="w-[300px]" />;
      default:
        return <></>;
    }
  };

  const CustomBlock = ({ block, contentState }) => {
    const entity = contentState.getEntity(block.getEntityAt(0));
    if (!entity) return;

    const entityType = entity.getType();
    const entityData = entity.getData();

    return (
      <div className="flex items-end">
        {renderEntity({ entityType, entityData })}
        <Trash
          size={20}
          className="cursor-pointer"
          onClick={() => handleRemoveCustomBlock({ block, contentState })}
        />
      </div>
    );
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const onFocus = () => {
    editorRef.current?.focus();
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const keyBindingFn = (event) => {
    if (event.keyCode === 9) {
      const newEditorState = RichUtils.onTab(event, editorState, 4);

      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  };

  const blockRendererFn = (contentBlock) => {
    if (contentBlock.getType() !== "atomic") return;

    return {
      component: CustomBlock,
      editable: false,
    };
  };

  const renderEditorControl = () => {
    return (
      <div className="p-2 border-b border-primary-300">
        <div className="flex gap-2">
          {EDITOR_CONTROLS.map((control, index) => {
            const checkActive = () => {
              if (control.type === CONTROL_TYPE.inlineStyle) {
                const currentStyle = editorState.getCurrentInlineStyle();
                return currentStyle.has(control.style);
              } else if (control.type === CONTROL_TYPE.blockType) {
                const selection = editorState.getSelection();
                const blockType = editorState
                  .getCurrentContent()
                  .getBlockForKey(selection.getStartKey())
                  .getType();
                return control.style === blockType;
              }
            };

            if (control.type === "divide") {
              return (
                <div
                  key={index}
                  className="w-0 border-r border-primary-300"
                ></div>
              );
            }

            return (
              <EditorControl
                key={index}
                control={control}
                active={checkActive()}
                editorRef={editorRef}
                editorState={editorState}
                setEditorState={setEditorState}
                editorError={editorError}
                setEditorError={setEditorError}
              />
            );
          })}
        </div>
        {editorError && <div className="text-error mt-2">{editorError}</div>}
      </div>
    );
  };

  return (
    <div>
      {/* {label && (
        <CustomTypography
          weight="medium"
          fontSize="text-md"
          className="mb-1.5 text-gray-700"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </CustomTypography>
      )} */}
      <div className="border border-primary-300 rounded-[8px] focus-within:border-primary-500">
        {renderEditorControl()}
        <div className={clsx("p-2 text-left")} onClick={onFocus}>
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
            onChange={onChange}
            placeholder={placeholder}
            ref={editorRef}
            blockRendererFn={blockRendererFn}
          />
        </div>
        <div>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
