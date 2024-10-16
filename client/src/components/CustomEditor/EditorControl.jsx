import React, { useEffect, useRef, useState } from "react";
import CustomTooltip from "../CustomTooltip";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import clsx from "clsx";
import "../../styles/customEditor.css";
import {
  CONTROL_TYPE,
  CUSTOM_ENTITY,
  isLink,
  isYoutubeEmbed,
} from "./constant";
import { AtomicBlockUtils, EditorState, RichUtils } from "draft-js";

export default function EditorControl({
  control,
  active,
  editorRef,
  editorState,
  setEditorState,
  editorError,
  setEditorError,
}) {
  console.log("render control");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState("");

  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);

  useOnClickOutside({
    ref: inputContainerRef,
    handler: () => setShowInput(false),
  });

  const handleChangeInputValue = () => {
    setInputValue(event.target.value);
    errorInput && setErrorInput("");
  };

  const handleEnter = (event) => {
    if (event.which === 13) {
      handleAddValue();
    }
  };

  const handleClickCustomAddLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      setEditorError("You need to select text for add link");
      return;
    }
    editorError && setEditorError("");
    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const contentBlock = contentState.getBlockForKey(startKey);
    const entityKey = contentBlock.getEntityAt(startOffset);
    let url = "";

    if (entityKey) {
      const entity = contentState.getEntity(entityKey);
      url = entity.getData().url;
    }

    setShowInput((prev) => !prev);
    setInputValue(url);
  };

  const handleClickCustomRemoveLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      setEditorError("You need to select link for remove");
      return;
    }
    setEditorError("");
    setEditorState(RichUtils.toggleLink(editorState, selection, null));
    // setTimeout(() => {
    //   editorRef.current && editorRef.current.focus();
    // }, 0);
  };

  const handleClickCustomEmbed = () => {
    setShowInput(true);
  };

  const handleAddValue = () => {
    const contentState = editorState.getCurrentContent();
    let newEntity, entityKey, newEditorState;
    switch (control.type) {
      case CONTROL_TYPE.customAddLink:
        if (!isLink(inputValue)) {
          setErrorInput("Link not valid");
          return;
        }

        newEntity = contentState.createEntity(CUSTOM_ENTITY.LINK, "MUTABLE", {
          url: inputValue,
        });
        entityKey = newEntity.getLastCreatedEntityKey();

        newEditorState = EditorState.set(editorState, {
          currentContent: newEntity,
        });

        newEditorState = RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        );
        setEditorState(newEditorState);
        break;
      case CONTROL_TYPE.customEmbed:
        if (!isYoutubeEmbed(inputValue)) {
          setErrorInput(
            "Only support embed for youtube\n(ex: https://www.youtube.com/embed/47QLB65466s)"
          );
          return;
        }

        newEntity = contentState.createEntity(
          CUSTOM_ENTITY.EMBED,
          "IMMUTABLE",
          {
            src: inputValue,
          }
        );

        entityKey = newEntity.getLastCreatedEntityKey();

        newEditorState = EditorState.set(editorState, {
          currentContent: newEntity,
        });

        setEditorState(
          EditorState.forceSelection(
            AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
            contentState.getSelectionAfter()
          )
        );
        break;

      default:
        break;
    }

    setShowInput(false);
    setInputValue("");
    setTimeout(() => {
      editorRef.current && editorRef.current.focus();
    }, 0);
  };

  const handleClick = () => {
    switch (control.type) {
      case CONTROL_TYPE.inlineStyle:
        setEditorState(RichUtils.toggleInlineStyle(editorState, control.style));
        break;
      case CONTROL_TYPE.blockType:
        setEditorState(RichUtils.toggleBlockType(editorState, control.style));
        break;
      case CONTROL_TYPE.customAddLink:
        handleClickCustomAddLink();
        break;
      case CONTROL_TYPE.customRemoveLink:
        handleClickCustomRemoveLink();
        break;
      case CONTROL_TYPE.customEmbed:
        handleClickCustomEmbed();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div className="relative" ref={inputContainerRef}>
      <CustomTooltip title={control.label}>
        <div
          className={clsx(
            "cursor-pointer p-1 border rounded-[8px]",
            active && "bg-[#eee]"
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <control.icon size={20} weight="light" />
        </div>
      </CustomTooltip>
      {showInput &&
        [CONTROL_TYPE.customAddLink, CONTROL_TYPE.customEmbed].includes(
          control.type
        ) && (
          <div className="absolute left-1/2 -translate-x-1/2 z-[1] bg-primary-100 border p-4 rounded-[8px] mt-[5px]">
            <div className="flex items-center gap-2">
              <label htmlFor="input">
                {control.type === CONTROL_TYPE.customAddLink ? "Link" : "Embed"}
              </label>
              <input
                id="input"
                ref={inputRef}
                value={inputValue}
                className="px-2 py-1 outline-none border border-primary-300 rounded-[8px] focus:border-primary-400"
                type="text"
                onChange={handleChangeInputValue}
                onKeyDown={handleEnter}
              />
              <button
                className="px-2 py-1 border rounded-[8px]"
                onClick={handleAddValue}
              >
                Add
              </button>
            </div>
            {errorInput && (
              <div className="mt-2 text-center text-error whitespace-pre">
                {errorInput}
              </div>
            )}

            <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-primary-300 transform"></div>
          </div>
        )}
    </div>
  );
}
