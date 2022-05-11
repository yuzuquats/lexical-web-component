/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const getSelection = () => window.getSelection();

var getDOMSelection = getSelection;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
// DOM
const DOM_ELEMENT_TYPE = 1;
const DOM_TEXT_TYPE = 3; // Reconciling

const NO_DIRTY_NODES = 0;
const HAS_DIRTY_NODES = 1;
const FULL_RECONCILE = 2; // Text node modes

const IS_NORMAL = 0;
const IS_TOKEN = 1;
const IS_SEGMENTED = 2;
const IS_INERT = 3; // Text node formatting

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6; // Text node details

const IS_DIRECTIONLESS = 1;
const IS_UNMERGEABLE = 1 << 1; // Element node formatting

const IS_ALIGN_LEFT = 1;
const IS_ALIGN_CENTER = 2;
const IS_ALIGN_RIGHT = 3;
const IS_ALIGN_JUSTIFY = 4; // Reconciliation

const ZERO_WIDTH_CHAR = "\u200b";
const DOUBLE_LINE_BREAK = "\n\n";
const RTL = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
const LTR =
  "A-Za-z\u00C0-\u00D6\u00D8-\u00F6" +
  "\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C" +
  "\uFE00-\uFE6F\uFEFD-\uFFFF";
const RTL_REGEX = new RegExp("^[^" + LTR + "]*[" + RTL + "]");
const LTR_REGEX = new RegExp("^[^" + RTL + "]*[" + LTR + "]");
const TEXT_TYPE_TO_FORMAT = {
  bold: IS_BOLD,
  code: IS_CODE,
  italic: IS_ITALIC,
  strikethrough: IS_STRIKETHROUGH,
  subscript: IS_SUBSCRIPT,
  superscript: IS_SUPERSCRIPT,
  underline: IS_UNDERLINE,
};
const ELEMENT_TYPE_TO_FORMAT = {
  center: IS_ALIGN_CENTER,
  justify: IS_ALIGN_JUSTIFY,
  left: IS_ALIGN_LEFT,
  right: IS_ALIGN_RIGHT,
};
const TEXT_MODE_TO_TYPE = {
  inert: IS_INERT,
  normal: IS_NORMAL,
  segmented: IS_SEGMENTED,
  token: IS_TOKEN,
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const CAN_USE_DOM =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const documentMode =
  CAN_USE_DOM && "documentMode" in document ? document.documentMode : null;
const IS_APPLE = CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const IS_FIREFOX =
  CAN_USE_DOM && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
const CAN_USE_BEFORE_INPUT =
  CAN_USE_DOM && "InputEvent" in window && !documentMode
    ? "getTargetRanges" in new window.InputEvent("input")
    : false;
const IS_SAFARI =
  CAN_USE_DOM && /Version\/[\d\.]+.*Safari/.test(navigator.userAgent);
const IS_IOS =
  CAN_USE_DOM &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream; // Keep these in case we need to use them in the future.
// export const IS_WINDOWS: boolean = CAN_USE_DOM && /Win/.test(navigator.platform);
// export const IS_CHROME: boolean = CAN_USE_DOM && /^(?=.*Chrome).*/i.test(navigator.userAgent);
// export const canUseTextInputEvent: boolean = CAN_USE_DOM && 'TextEvent' in window && !documentMode;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
let keyCounter = 0;
function generateRandomKey() {
  return "" + keyCounter++;
}
function getRegisteredNodeOrThrow(editor, nodeType) {
  const registeredNode = editor._nodes.get(nodeType);

  if (registeredNode === undefined) {
    {
      throw Error(`registeredNode: Type ${nodeType} not found`);
    }
  }

  return registeredNode;
}
const scheduleMicroTask =
  typeof queueMicrotask === "function"
    ? queueMicrotask
    : (fn) => {
        // No window prefix intended (#1400)
        Promise.resolve().then(fn);
      };

function isSelectionCapturedInDecoratorInput(anchorDOM) {
  const activeElement = document.activeElement;
  const nodeName = activeElement !== null ? activeElement.nodeName : null;
  return (
    !$isDecoratorNode($getNearestNodeFromDOMNode(anchorDOM)) ||
    (nodeName !== "INPUT" && nodeName !== "TEXTAREA")
  );
}

function isSelectionWithinEditor(editor, anchorDOM, focusDOM) {
  const rootElement = editor.getRootElement();

  try {
    return (
      rootElement !== null &&
      rootElement.contains(anchorDOM) &&
      rootElement.contains(focusDOM) && // Ignore if selection is within nested editor
      anchorDOM !== null &&
      isSelectionCapturedInDecoratorInput(anchorDOM) &&
      getNearestEditorFromDOMNode(anchorDOM) === editor
    );
  } catch (error) {
    return false;
  }
}
function getNearestEditorFromDOMNode(node) {
  let currentNode = node;

  while (currentNode != null) {
    // $FlowFixMe: internal field
    const editor = currentNode.__lexicalEditor;

    if (editor != null && !editor.isReadOnly()) {
      return editor;
    }

    currentNode = currentNode.parentNode;
  }

  return null;
}
function getTextDirection(text) {
  if (RTL_REGEX.test(text)) {
    return "rtl";
  }

  if (LTR_REGEX.test(text)) {
    return "ltr";
  }

  return null;
}
function $isTokenOrInertOrSegmented(node) {
  return $isTokenOrInert(node) || node.isSegmented();
}
function $isTokenOrInert(node) {
  return node.isToken() || node.isInert();
}
function getDOMTextNode(element) {
  let node = element;

  while (node != null) {
    if (node.nodeType === DOM_TEXT_TYPE) {
      // $FlowFixMe: this is a Text
      return node;
    }

    node = node.firstChild;
  }

  return null;
}
function toggleTextFormatType(format, type, alignWithFormat) {
  const activeFormat = TEXT_TYPE_TO_FORMAT[type];
  const isStateFlagPresent = format & activeFormat;

  if (
    isStateFlagPresent &&
    (alignWithFormat === null || (alignWithFormat & activeFormat) === 0)
  ) {
    // Remove the state flag.
    return format ^ activeFormat;
  }

  if (alignWithFormat === null || alignWithFormat & activeFormat) {
    // Add the state flag.
    return format | activeFormat;
  }

  return format;
}
function $isLeafNode(node) {
  return $isTextNode(node) || $isLineBreakNode(node) || $isDecoratorNode(node);
}
function $setNodeKey(node, existingKey) {
  if (existingKey != null) {
    node.__key = existingKey;
    return;
  }

  errorOnReadOnly();
  errorOnInfiniteTransforms();
  const editor = getActiveEditor();
  const editorState = getActiveEditorState();
  const key = generateRandomKey();

  editorState._nodeMap.set(key, node); // TODO Split this function into leaf/element

  if ($isElementNode(node)) {
    editor._dirtyElements.set(key, true);
  } else {
    editor._dirtyLeaves.add(key);
  }

  editor._cloneNotNeeded.add(key);

  editor._dirtyType = HAS_DIRTY_NODES;
  node.__key = key;
}

function internalMarkParentElementsAsDirty(parentKey, nodeMap, dirtyElements) {
  let nextParentKey = parentKey;

  while (nextParentKey !== null) {
    if (dirtyElements.has(nextParentKey)) {
      return;
    }

    const node = nodeMap.get(nextParentKey);

    if (node === undefined) {
      break;
    }

    dirtyElements.set(nextParentKey, false);
    nextParentKey = node.__parent;
  }
}

function removeFromParent(writableNode) {
  const oldParent = writableNode.getParent();

  if (oldParent !== null) {
    const writableParent = oldParent.getWritable();
    const children = writableParent.__children;
    const index = children.indexOf(writableNode.__key);

    if (index === -1) {
      {
        throw Error(`Node is not a child of its parent`);
      }
    }

    internalMarkSiblingsAsDirty(writableNode);
    children.splice(index, 1);
  }
} // Never use this function directly! It will break
// the cloning heuristic. Instead use node.getWritable().

function internalMarkNodeAsDirty(node) {
  errorOnInfiniteTransforms();
  const latest = node.getLatest();
  const parent = latest.__parent;
  const editorState = getActiveEditorState();
  const editor = getActiveEditor();
  const nodeMap = editorState._nodeMap;
  const dirtyElements = editor._dirtyElements;

  if (parent !== null) {
    internalMarkParentElementsAsDirty(parent, nodeMap, dirtyElements);
  }

  const key = latest.__key;
  editor._dirtyType = HAS_DIRTY_NODES;

  if ($isElementNode(node)) {
    dirtyElements.set(key, true);
  } else {
    // TODO split internally MarkNodeAsDirty into two dedicated Element/leave functions
    editor._dirtyLeaves.add(key);
  }
}
function internalMarkSiblingsAsDirty(node) {
  const previousNode = node.getPreviousSibling();
  const nextNode = node.getNextSibling();

  if (previousNode !== null) {
    internalMarkNodeAsDirty(previousNode);
  }

  if (nextNode !== null) {
    internalMarkNodeAsDirty(nextNode);
  }
}
function $setCompositionKey(compositionKey) {
  errorOnReadOnly();
  const editor = getActiveEditor();
  const previousCompositionKey = editor._compositionKey;

  if (compositionKey !== previousCompositionKey) {
    editor._compositionKey = compositionKey;

    if (previousCompositionKey !== null) {
      const node = $getNodeByKey(previousCompositionKey);

      if (node !== null) {
        node.getWritable();
      }
    }

    if (compositionKey !== null) {
      const node = $getNodeByKey(compositionKey);

      if (node !== null) {
        node.getWritable();
      }
    }
  }
}
function $getCompositionKey() {
  const editor = getActiveEditor();
  return editor._compositionKey;
}
function $getNodeByKey(key, _editorState) {
  const editorState = _editorState || getActiveEditorState();

  const node = editorState._nodeMap.get(key);

  if (node === undefined) {
    return null;
  }

  return node;
}
function getNodeFromDOMNode(dom, editorState) {
  const editor = getActiveEditor(); // $FlowFixMe: internal field

  const key = dom["__lexicalKey_" + editor._key];

  if (key !== undefined) {
    return $getNodeByKey(key, editorState);
  }

  return null;
}
function $getNearestNodeFromDOMNode(startingDOM, editorState) {
  let dom = startingDOM;

  while (dom != null) {
    const node = getNodeFromDOMNode(dom, editorState);

    if (node !== null) {
      return node;
    }

    dom = dom.parentNode;
  }

  return null;
}
function cloneDecorators(editor) {
  const currentDecorators = editor._decorators;
  const pendingDecorators = Object.assign({}, currentDecorators);
  editor._pendingDecorators = pendingDecorators;
  return pendingDecorators;
}
function getEditorStateTextContent(editorState) {
  return editorState.read((view) => $getRoot().getTextContent());
}
function markAllNodesAsDirty(editor, type) {
  // Mark all existing text nodes as dirty
  updateEditor(
    editor,
    () => {
      const editorState = getActiveEditorState();

      if (editorState.isEmpty()) {
        return;
      }

      if (type === "root") {
        $getRoot().markDirty();
        return;
      }

      const nodeMap = editorState._nodeMap;

      for (const [, node] of nodeMap) {
        node.markDirty();
      }
    },
    editor._pendingEditorState === null
      ? {
          tag: "history-merge",
        }
      : undefined
  );
}
function $getRoot() {
  return internalGetRoot(getActiveEditorState());
}
function internalGetRoot(editorState) {
  return editorState._nodeMap.get(
    "root" // $FlowFixMe: root is always in our Map
  );
}
function $setSelection(selection) {
  const editorState = getActiveEditorState();

  if (selection !== null && Object.isFrozen(selection)) {
    console.warn(
      "$setSelection called on frozen selection object. Ensure selection is cloned before passing in."
    );
  }

  editorState._selection = selection;
}
function $flushMutations$1() {
  errorOnReadOnly();
  const editor = getActiveEditor();
  flushRootMutations(editor);
}
function getNodeFromDOM(dom) {
  const editor = getActiveEditor();
  const nodeKey = getNodeKeyFromDOM(dom, editor);

  if (nodeKey === null) {
    const rootElement = editor.getRootElement();

    if (dom === rootElement) {
      return $getNodeByKey("root");
    }

    return null;
  }

  return $getNodeByKey(nodeKey);
}
function getTextNodeOffset(node, moveSelectionToEnd) {
  return moveSelectionToEnd ? node.getTextContentSize() : 0;
}

function getNodeKeyFromDOM(dom, editor) {
  // Note that node here refers to a DOM Node, not an Lexical Node
  let node = dom;

  while (node != null) {
    const key = node["__lexicalKey_" + editor._key]; // $FlowFixMe: internal field

    if (key !== undefined) {
      return key;
    }

    node = node.parentNode;
  }

  return null;
}

function doesContainGrapheme(str) {
  return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(str);
}
function getEditorsToPropagate(editor) {
  const editorsToPropagate = [];
  let currentEditor = editor;

  while (currentEditor !== null) {
    editorsToPropagate.push(currentEditor);
    currentEditor = currentEditor._parentEditor;
  }

  return editorsToPropagate;
}
function createUID() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}
function $updateSelectedTextFromDOM(editor, compositionEndEvent) {
  // Update the text content with the latest composition text
  const domSelection = getDOMSelection();

  if (domSelection === null) {
    return;
  }

  const anchorNode = domSelection.anchorNode;
  let { anchorOffset, focusOffset } = domSelection;

  if (anchorNode !== null && anchorNode.nodeType === DOM_TEXT_TYPE) {
    const node = $getNearestNodeFromDOMNode(anchorNode);

    if ($isTextNode(node)) {
      let textContent = anchorNode.nodeValue;
      const data = compositionEndEvent !== null && compositionEndEvent.data; // Data is intentionally truthy, as we check for boolean, null and empty string.

      if (textContent === ZERO_WIDTH_CHAR && data) {
        const offset = data.length;
        textContent = data;
        anchorOffset = offset;
        focusOffset = offset;
      }

      $updateTextNodeFromDOMContent(
        node,
        textContent,
        anchorOffset,
        focusOffset,
        compositionEndEvent !== null
      );
    }
  }
}
function $updateTextNodeFromDOMContent(
  textNode,
  textContent,
  anchorOffset,
  focusOffset,
  compositionEnd
) {
  let node = textNode;

  if (node.isAttached() && (compositionEnd || !node.isDirty())) {
    const isComposing = node.isComposing();
    let normalizedTextContent = textContent;

    if (
      (isComposing || compositionEnd) &&
      textContent[textContent.length - 1] === ZERO_WIDTH_CHAR
    ) {
      normalizedTextContent = textContent.slice(0, -1);
    }

    const prevTextContent = node.getTextContent();

    if (compositionEnd || normalizedTextContent !== prevTextContent) {
      if (normalizedTextContent === "") {
        $setCompositionKey(null);

        if (!IS_SAFARI && !IS_IOS) {
          // For composition (mainly Android), we have to remove the node on a later update
          const editor = getActiveEditor();
          setTimeout(() => {
            editor.update(() => {
              if (node.isAttached()) {
                node.remove();
              }
            });
          }, 20);
        } else {
          node.remove();
        }

        return;
      }

      const parent = node.getParent();
      const prevSelection = $getPreviousSelection();

      if (
        $isTokenOrInert(node) ||
        ($getCompositionKey() !== null && !isComposing) || // Check if character was added at the start, and we need
        // to clear this input from occuring as that action wasn't
        // permitted.
        (parent !== null &&
          $isRangeSelection(prevSelection) &&
          !parent.canInsertTextBefore() &&
          prevSelection.anchor.offset === 0)
      ) {
        node.markDirty();
        return;
      }

      const selection = $getSelection();

      if (
        !$isRangeSelection(selection) ||
        anchorOffset === null ||
        focusOffset === null
      ) {
        node.setTextContent(normalizedTextContent);
        return;
      }

      selection.setTextNodeRange(node, anchorOffset, node, focusOffset);

      if (node.isSegmented()) {
        const originalTextContent = node.getTextContent();
        const replacement = $createTextNode(originalTextContent);
        node.replace(replacement);
        node = replacement;
      }

      node.setTextContent(normalizedTextContent);
    }
  }
}

function $shouldInsertTextAfterOrBeforeTextNode(selection, node) {
  if (node.isSegmented()) {
    return true;
  }

  if (!selection.isCollapsed()) {
    return false;
  }

  const offset = selection.anchor.offset;
  const parent = node.getParentOrThrow();
  const isToken = node.isToken();
  const shouldInsertTextBefore =
    offset === 0 &&
    (!node.canInsertTextBefore() || !parent.canInsertTextBefore() || isToken);
  const shouldInsertTextAfter =
    node.getTextContentSize() === offset &&
    (!node.canInsertTextBefore() || !parent.canInsertTextBefore() || isToken);
  return shouldInsertTextBefore || shouldInsertTextAfter;
}

function $shouldPreventDefaultAndInsertText(selection, text, isBeforeInput) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const domSelection = getDOMSelection();
  const domAnchorNode = domSelection !== null ? domSelection.anchorNode : null;
  const anchorKey = anchor.key;
  const backingAnchorElement = getActiveEditor().getElementByKey(anchorKey);
  return (
    anchorKey !== focus.key || // If we're working with a non-text node.
    !$isTextNode(anchorNode) || // If we're working with a range that is not during composition.
    (anchor.offset !== focus.offset && !anchorNode.isComposing()) || // If the text length is more than a single character and we're either
    // dealing with this in "beforeinput" or where the node has already recently
    // been changed (thus is dirty).
    ((isBeforeInput || anchorNode.isDirty()) && text.length > 1) || // If the DOM selection element is not the same as the backing node
    (backingAnchorElement !== null &&
      !anchorNode.isComposing() &&
      domAnchorNode !== getDOMTextNode(backingAnchorElement)) || // Check if we're changing from bold to italics, or some other format.
    anchorNode.getFormat() !== selection.format || // One last set of heuristics to check against.
    $shouldInsertTextAfterOrBeforeTextNode(selection, anchorNode)
  );
}
function isTab(keyCode, altKey, ctrlKey, metaKey) {
  return keyCode === 9 && !altKey && !ctrlKey && !metaKey;
}
function isBold(keyCode, altKey, metaKey, ctrlKey) {
  return keyCode === 66 && !altKey && controlOrMeta(metaKey, ctrlKey);
}
function isItalic(keyCode, altKey, metaKey, ctrlKey) {
  return keyCode === 73 && !altKey && controlOrMeta(metaKey, ctrlKey);
}
function isUnderline(keyCode, altKey, metaKey, ctrlKey) {
  return keyCode === 85 && !altKey && controlOrMeta(metaKey, ctrlKey);
}
function isParagraph(keyCode, shiftKey) {
  return isReturn(keyCode) && !shiftKey;
}
function isLineBreak(keyCode, shiftKey) {
  return isReturn(keyCode) && shiftKey;
} // Inserts a new line after the selection

function isOpenLineBreak(keyCode, ctrlKey) {
  // 79 = KeyO
  return IS_APPLE && ctrlKey && keyCode === 79;
}
function isDeleteWordBackward(keyCode, altKey, ctrlKey) {
  return isBackspace(keyCode) && (IS_APPLE ? altKey : ctrlKey);
}
function isDeleteWordForward(keyCode, altKey, ctrlKey) {
  return isDelete(keyCode) && (IS_APPLE ? altKey : ctrlKey);
}
function isDeleteLineBackward(keyCode, metaKey) {
  return IS_APPLE && metaKey && isBackspace(keyCode);
}
function isDeleteLineForward(keyCode, metaKey) {
  return IS_APPLE && metaKey && isDelete(keyCode);
}
function isDeleteBackward(keyCode, altKey, metaKey, ctrlKey) {
  if (IS_APPLE) {
    if (altKey || metaKey) {
      return false;
    }

    return isBackspace(keyCode) || (keyCode === 72 && ctrlKey);
  }

  if (ctrlKey || altKey || metaKey) {
    return false;
  }

  return isBackspace(keyCode);
}
function isDeleteForward(keyCode, ctrlKey, shiftKey, altKey, metaKey) {
  if (IS_APPLE) {
    if (shiftKey || altKey || metaKey) {
      return false;
    }

    return isDelete(keyCode) || (keyCode === 68 && ctrlKey);
  }

  if (ctrlKey || altKey || metaKey) {
    return false;
  }

  return isDelete(keyCode);
}
function isUndo(keyCode, shiftKey, metaKey, ctrlKey) {
  return keyCode === 90 && !shiftKey && controlOrMeta(metaKey, ctrlKey);
}
function isRedo(keyCode, shiftKey, metaKey, ctrlKey) {
  if (IS_APPLE) {
    return keyCode === 90 && metaKey && shiftKey;
  }

  return (keyCode === 89 && ctrlKey) || (keyCode === 90 && ctrlKey && shiftKey);
}

function isArrowLeft(keyCode) {
  return keyCode === 37;
}

function isArrowRight(keyCode) {
  return keyCode === 39;
}

function isArrowUp(keyCode) {
  return keyCode === 38;
}

function isArrowDown(keyCode) {
  return keyCode === 40;
}

function isMoveBackward(keyCode, ctrlKey, shiftKey, altKey, metaKey) {
  return isArrowLeft(keyCode) && !ctrlKey && !metaKey && !altKey;
}
function isMoveForward(keyCode, ctrlKey, shiftKey, altKey, metaKey) {
  return isArrowRight(keyCode) && !ctrlKey && !metaKey && !altKey;
}
function isMoveUp(keyCode, ctrlKey, shiftKey, altKey, metaKey) {
  return isArrowUp(keyCode) && !ctrlKey && !metaKey;
}
function isMoveDown(keyCode, ctrlKey, shiftKey, altKey, metaKey) {
  return isArrowDown(keyCode) && !ctrlKey && !metaKey;
}
function isModifier(ctrlKey, shiftKey, altKey, metaKey) {
  return ctrlKey || shiftKey || altKey || metaKey;
}
function controlOrMeta(metaKey, ctrlKey) {
  if (IS_APPLE) {
    return metaKey;
  }

  return ctrlKey;
}
function isReturn(keyCode) {
  return keyCode === 13;
}
function isBackspace(keyCode) {
  return keyCode === 8;
}
function isEscape(keyCode) {
  return keyCode === 27;
}
function isDelete(keyCode) {
  return keyCode === 46;
}
function getCachedClassNameArray(classNamesTheme, classNameThemeType) {
  const classNames = classNamesTheme[classNameThemeType]; // As we're using classList, we need
  // to handle className tokens that have spaces.
  // The easiest way to do this to convert the
  // className tokens to an array that can be
  // applied to classList.add()/remove().

  if (typeof classNames === "string") {
    const classNamesArr = classNames.split(" ");
    classNamesTheme[classNameThemeType] = classNamesArr;
    return classNamesArr;
  }

  return classNames;
}
function setMutatedNode(
  mutatedNodes,
  registeredNodes,
  mutationListeners,
  node,
  mutation
) {
  if (mutationListeners.size === 0) {
    return;
  }

  const nodeType = node.__type;
  const nodeKey = node.__key;
  const registeredNode = registeredNodes.get(nodeType);

  if (registeredNode === undefined) {
    {
      throw Error(`Type ${nodeType} not in registeredNodes`);
    }
  }

  const klass = registeredNode.klass;
  let mutatedNodesByType = mutatedNodes.get(klass);

  if (mutatedNodesByType === undefined) {
    mutatedNodesByType = new Map();
    mutatedNodes.set(klass, mutatedNodesByType);
  }

  if (!mutatedNodesByType.has(nodeKey)) {
    mutatedNodesByType.set(nodeKey, mutation);
  }
}
function $nodesOfType(klass) {
  const editorState = getActiveEditorState();
  const readOnly = editorState._readOnly;
  const klassType = klass.getType();
  const nodes = editorState._nodeMap;
  const nodesOfType = [];

  for (const [, node] of nodes) {
    if (
      node instanceof klass &&
      node.__type === klassType &&
      (readOnly || node.isAttached())
    ) {
      nodesOfType.push(node);
    }
  }

  return nodesOfType;
}

function resolveElement(element, isBackward, focusOffset) {
  const parent = element.getParent();
  let offset = focusOffset;
  let block = element;

  if (parent !== null) {
    if (isBackward && focusOffset === 0) {
      offset = block.getIndexWithinParent();
      block = parent;
    } else if (!isBackward && focusOffset === block.getChildrenSize()) {
      offset = block.getIndexWithinParent() + 1;
      block = parent;
    }
  }

  return block.getChildAtIndex(isBackward ? offset - 1 : offset);
}

function $getDecoratorNode(focus, isBackward) {
  const focusOffset = focus.offset;

  if (focus.type === "element") {
    const block = focus.getNode();
    return resolveElement(block, isBackward, focusOffset);
  } else {
    const focusNode = focus.getNode();

    if (
      (isBackward && focusOffset === 0) ||
      (!isBackward && focusOffset === focusNode.getTextContentSize())
    ) {
      const possibleNode = isBackward
        ? focusNode.getPreviousSibling()
        : focusNode.getNextSibling();

      if (possibleNode === null) {
        return resolveElement(
          focusNode.getParentOrThrow(),
          isBackward,
          focusNode.getIndexWithinParent() + (isBackward ? 0 : 1)
        );
      }

      return possibleNode;
    }
  }

  return null;
}
function isFirefoxClipboardEvents() {
  const event = window.event;
  const inputType = event && event.inputType;
  return (
    inputType === "insertFromPaste" ||
    inputType === "insertFromPasteAsQuotation"
  );
}
function dispatchCommand(editor, type, payload) {
  return triggerCommandListeners(editor, type, payload);
}
function $textContentRequiresDoubleLinebreakAtEnd(node) {
  return !$isRootNode(node) && !node.isLastChild() && !node.isInline();
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function $garbageCollectDetachedDecorators(editor, pendingEditorState) {
  const currentDecorators = editor._decorators;
  const pendingDecorators = editor._pendingDecorators;
  let decorators = pendingDecorators || currentDecorators;
  const nodeMap = pendingEditorState._nodeMap;
  let key;

  for (key in decorators) {
    if (!nodeMap.has(key)) {
      if (decorators === currentDecorators) {
        decorators = cloneDecorators(editor);
      }

      delete decorators[key];
    }
  }
}

function $garbageCollectDetachedDeepChildNodes(
  node,
  parentKey,
  prevNodeMap,
  nodeMap,
  dirtyNodes
) {
  const children = node.__children;
  const childrenLength = children.length;

  for (let i = 0; i < childrenLength; i++) {
    const childKey = children[i];
    const child = nodeMap.get(childKey);

    if (child !== undefined && child.__parent === parentKey) {
      if ($isElementNode(child)) {
        $garbageCollectDetachedDeepChildNodes(
          child,
          childKey,
          prevNodeMap,
          nodeMap,
          dirtyNodes
        );
      } // If we have created a node and it was dereferenced, then also
      // remove it from out dirty nodes Set.

      if (!prevNodeMap.has(childKey)) {
        dirtyNodes.delete(childKey);
      }

      nodeMap.delete(childKey);
    }
  }
}

function $garbageCollectDetachedNodes(
  prevEditorState,
  editorState,
  dirtyLeaves,
  dirtyElements
) {
  const prevNodeMap = prevEditorState._nodeMap;
  const nodeMap = editorState._nodeMap;

  for (const nodeKey of dirtyLeaves) {
    const node = nodeMap.get(nodeKey);

    if (node !== undefined && !node.isAttached()) {
      if (!prevNodeMap.has(nodeKey)) {
        dirtyLeaves.delete(nodeKey);
      }

      nodeMap.delete(nodeKey);
    }
  }

  for (const [nodeKey] of dirtyElements) {
    const node = nodeMap.get(nodeKey);

    if (node !== undefined) {
      // Garbage collect node and its children if they exist
      if (!node.isAttached()) {
        if ($isElementNode(node)) {
          $garbageCollectDetachedDeepChildNodes(
            node,
            nodeKey,
            prevNodeMap,
            nodeMap,
            dirtyElements
          );
        } // If we have created a node and it was dereferenced, then also
        // remove it from out dirty nodes Set.

        if (!prevNodeMap.has(nodeKey)) {
          dirtyElements.delete(nodeKey);
        }

        nodeMap.delete(nodeKey);
      }
    }
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

function $canSimpleTextNodesBeMerged(node1, node2) {
  const node1Mode = node1.__mode;
  const node1Format = node1.__format;
  const node1Style = node1.__style;
  const node2Mode = node2.__mode;
  const node2Format = node2.__format;
  const node2Style = node2.__style;
  return (
    (node1Mode === null || node1Mode === node2Mode) &&
    (node1Format === null || node1Format === node2Format) &&
    (node1Style === null || node1Style === node2Style)
  );
}

function $mergeTextNodes(node1, node2) {
  const writableNode1 = node1.mergeWithSibling(node2);

  const normalizedNodes = getActiveEditor()._normalizedNodes;

  normalizedNodes.add(node1.__key);
  normalizedNodes.add(node2.__key);
  return writableNode1;
}

function $normalizeTextNode(textNode) {
  let node = textNode;

  if (node.__text === "" && node.isSimpleText() && !node.isUnmergeable()) {
    node.remove();
    return;
  } // Backward

  let previousNode;

  while (
    (previousNode = node.getPreviousSibling()) !== null &&
    $isTextNode(previousNode) &&
    previousNode.isSimpleText() &&
    !previousNode.isUnmergeable()
  ) {
    if (previousNode.__text === "") {
      previousNode.remove();
    } else if ($canSimpleTextNodesBeMerged(previousNode, node)) {
      node = $mergeTextNodes(previousNode, node);
      break;
    } else {
      break;
    }
  } // Forward

  let nextNode;

  while (
    (nextNode = node.getNextSibling()) !== null &&
    $isTextNode(nextNode) &&
    nextNode.isSimpleText() &&
    !nextNode.isUnmergeable()
  ) {
    if (nextNode.__text === "") {
      nextNode.remove();
    } else if ($canSimpleTextNodesBeMerged(node, nextNode)) {
      node = $mergeTextNodes(node, nextNode);
      break;
    } else {
      break;
    }
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function $createNodeFromParse(parsedNode, parsedNodeMap) {
  errorOnReadOnly();
  const editor = getActiveEditor();
  return internalCreateNodeFromParse(parsedNode, parsedNodeMap, editor, null);
}
function internalCreateNodeFromParse(
  parsedNode,
  parsedNodeMap,
  editor,
  parentKey,
  state = {
    originalSelection: null,
  }
) {
  const nodeType = parsedNode.__type;

  const registeredNode = editor._nodes.get(nodeType);

  if (registeredNode === undefined) {
    {
      throw Error(`createNodeFromParse: type "${nodeType}" + not found`);
    }
  } // Check for properties that are editors

  for (const property in parsedNode) {
    const value = parsedNode[property];

    if (value != null && typeof value === "object") {
      const parsedEditorState = value.editorState;

      if (parsedEditorState != null) {
        const nestedEditor = createEditor();
        nestedEditor._nodes = editor._nodes;
        nestedEditor._parentEditor = editor._parentEditor;
        nestedEditor._pendingEditorState = parseEditorState(
          parsedEditorState,
          nestedEditor
        );
        parsedNode[property] = nestedEditor;
      }
    }
  }

  const NodeKlass = registeredNode.klass;
  const parsedKey = parsedNode.__key; // We set the parsedKey to undefined before calling clone() so that
  // we get a new random key assigned.

  parsedNode.__key = undefined;
  const node = NodeKlass.clone(parsedNode);
  parsedNode.__key = parsedKey;
  const key = node.__key;

  if ($isRootNode(node)) {
    const editorState = getActiveEditorState();

    editorState._nodeMap.set("root", node);
  }

  node.__parent = parentKey; // We will need to recursively handle the children in the case
  // of a ElementNode.

  if ($isElementNode(node)) {
    const children = parsedNode.__children;

    for (let i = 0; i < children.length; i++) {
      const childKey = children[i];
      const parsedChild = parsedNodeMap.get(childKey);

      if (parsedChild !== undefined) {
        const child = internalCreateNodeFromParse(
          parsedChild,
          parsedNodeMap,
          editor,
          key,
          state
        );
        const newChildKey = child.__key;

        node.__children.push(newChildKey);
      }
    }

    node.__indent = parsedNode.__indent;
    node.__format = parsedNode.__format;
    node.__dir = parsedNode.__dir;
  } else if ($isTextNode(node)) {
    node.__format = parsedNode.__format;
    node.__style = parsedNode.__style;
    node.__mode = parsedNode.__mode;
    node.__detail = parsedNode.__detail;
    node.__marks = parsedNode.__marks;
  } // The selection might refer to an old node whose key has changed. Produce a
  // new selection record with the old keys mapped to the new ones.

  const originalSelection = state != null ? state.originalSelection : undefined;

  if (originalSelection != null) {
    let remappedSelection = state.remappedSelection;

    if (originalSelection.type === "range") {
      const anchor = originalSelection.anchor;
      const focus = originalSelection.focus;

      if (
        remappedSelection == null &&
        (parsedKey === anchor.key || parsedKey === focus.key)
      ) {
        state.remappedSelection = remappedSelection = {
          anchor: { ...anchor },
          focus: { ...focus },
          type: "range",
        };
      }

      if (remappedSelection != null && remappedSelection.type === "range") {
        if (parsedKey === anchor.key) {
          remappedSelection.anchor.key = key;
        }

        if (parsedKey === focus.key) {
          remappedSelection.focus.key = key;
        }
      }
    } else if (originalSelection.type === "node") {
      const nodes = originalSelection.nodes;
      const indexOf = nodes.indexOf(parsedKey);

      if (indexOf !== -1) {
        if (remappedSelection == null) {
          state.remappedSelection = remappedSelection = {
            nodes: [...nodes],
            type: "node",
          };
        }

        if (remappedSelection.type === "node") {
          remappedSelection.nodes.splice(indexOf, 1, key);
        }
      }
    } else if (originalSelection.type === "grid") {
      const gridKey = originalSelection.gridKey;
      const anchorCellKey = originalSelection.anchor.key;
      const focusCellKey = originalSelection.focus.key;

      if (
        remappedSelection == null &&
        (gridKey === parsedKey ||
          gridKey === anchorCellKey ||
          gridKey === focusCellKey)
      ) {
        state.remappedSelection = remappedSelection = {
          ...originalSelection,
          type: "grid",
        };
      }

      if (remappedSelection != null && remappedSelection.type === "grid") {
        if (gridKey === parsedKey) {
          remappedSelection.gridKey = key;
        }

        if (anchorCellKey === parsedKey) {
          remappedSelection.anchor.key = key;
        }

        if (focusCellKey === parsedKey) {
          remappedSelection.focus.key = key;
        }
      }
    }
  }

  return node;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function createCommand() {
  // $FlowFixMe: avoid freezing the object for perf reasons
  return {};
}
const SELECTION_CHANGE_COMMAND = createCommand();
const CLICK_COMMAND = createCommand();
const DELETE_CHARACTER_COMMAND = createCommand();
const INSERT_LINE_BREAK_COMMAND = createCommand();
const INSERT_PARAGRAPH_COMMAND = createCommand();
const INSERT_TEXT_COMMAND = createCommand();
const PASTE_COMMAND = createCommand();
const REMOVE_TEXT_COMMAND = createCommand();
const DELETE_WORD_COMMAND = createCommand();
const DELETE_LINE_COMMAND = createCommand();
const FORMAT_TEXT_COMMAND = createCommand();
const UNDO_COMMAND = createCommand();
const REDO_COMMAND = createCommand();
const KEY_ARROW_RIGHT_COMMAND = createCommand();
const KEY_ARROW_LEFT_COMMAND = createCommand();
const KEY_ARROW_UP_COMMAND = createCommand();
const KEY_ARROW_DOWN_COMMAND = createCommand();
const KEY_ENTER_COMMAND = createCommand();
const KEY_BACKSPACE_COMMAND = createCommand();
const KEY_ESCAPE_COMMAND = createCommand();
const KEY_DELETE_COMMAND = createCommand();
const KEY_TAB_COMMAND = createCommand();
const INDENT_CONTENT_COMMAND = createCommand();
const OUTDENT_CONTENT_COMMAND = createCommand();
const DROP_COMMAND = createCommand();
const FORMAT_ELEMENT_COMMAND = createCommand();
const DRAGSTART_COMMAND = createCommand();
const DRAGEND_COMMAND = createCommand();
const COPY_COMMAND = createCommand();
const CUT_COMMAND = createCommand();
const CLEAR_EDITOR_COMMAND = createCommand();
const CLEAR_HISTORY_COMMAND = createCommand();
const CAN_REDO_COMMAND = createCommand();
const CAN_UNDO_COMMAND = createCommand();
const FOCUS_COMMAND = createCommand();
const BLUR_COMMAND = createCommand();
const KEY_MODIFIER_COMMAND = createCommand();

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const PASS_THROUGH_COMMAND = Object.freeze({});
const ANDROID_COMPOSITION_LATENCY = 30;
const rootElementEvents = [
  // $FlowIgnore bad event inheritance
  ["keydown", onKeyDown], // $FlowIgnore bad event inheritance
  ["compositionstart", onCompositionStart], // $FlowIgnore bad event inheritance
  ["compositionend", onCompositionEnd], // $FlowIgnore bad event inheritance
  ["input", onInput], // $FlowIgnore bad event inheritance
  ["click", onClick],
  ["cut", PASS_THROUGH_COMMAND],
  ["copy", PASS_THROUGH_COMMAND],
  ["dragstart", PASS_THROUGH_COMMAND],
  ["paste", PASS_THROUGH_COMMAND],
  ["focus", PASS_THROUGH_COMMAND],
  ["blur", PASS_THROUGH_COMMAND],
];

if (CAN_USE_BEFORE_INPUT) {
  // $FlowIgnore bad event inheritance
  rootElementEvents.push(["beforeinput", onBeforeInput]);
} else {
  rootElementEvents.push(["drop", PASS_THROUGH_COMMAND]);
}

let lastKeyDownTimeStamp = 0;
let rootElementsRegistered = 0;
let isSelectionChangeFromReconcile = false;
let isInsertLineBreak = false;
let collapsedSelectionFormat = [0, 0, "root", 0];

function shouldSkipSelectionChange(domNode, offset) {
  return (
    domNode !== null &&
    domNode.nodeType === DOM_TEXT_TYPE &&
    offset !== 0 &&
    offset !== domNode.nodeValue.length
  );
}

function onSelectionChange(domSelection, editor, isActive) {
  if (isSelectionChangeFromReconcile) {
    isSelectionChangeFromReconcile = false;
    const { anchorNode, anchorOffset, focusNode, focusOffset } = domSelection; // If native DOM selection is on a DOM element, then
    // we should continue as usual, as Lexical's selection
    // may have normalized to a better child. If the DOM
    // element is a text node, we can safely apply this
    // optimization and skip the selection change entirely.
    // We also need to check if the offset is at the boundary,
    // because in this case, we might need to normalize to a
    // sibling instead.

    if (
      shouldSkipSelectionChange(anchorNode, anchorOffset) &&
      shouldSkipSelectionChange(focusNode, focusOffset)
    ) {
      return;
    }
  }

  updateEditor(editor, () => {
    // Non-active editor don't need any extra logic for selection, it only needs update
    // to reconcile selection (set it to null) to ensure that only one editor has non-null selection.
    if (!isActive) {
      $setSelection(null);
      return;
    }

    const selection = $getSelection(); // Update the selection format

    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();

      if (selection.isCollapsed()) {
        // Badly interpreted range selection when collapsed - #1482
        if (domSelection.type === "Range") {
          selection.dirty = true;
        } // If we have marked a collapsed selection format, and we're
        // within the given time range – then attempt to use that format
        // instead of getting the format from the anchor node.

        const currentTimeStamp = window.event.timeStamp;
        const [lastFormat, lastOffset, lastKey, timeStamp] =
          collapsedSelectionFormat;

        if (
          currentTimeStamp < timeStamp + 200 &&
          anchor.offset === lastOffset &&
          anchor.key === lastKey
        ) {
          selection.format = lastFormat;
        } else {
          if (anchor.type === "text") {
            selection.format = anchorNode.getFormat();
          } else if (anchor.type === "element") {
            selection.format = 0;
          }
        }
      } else {
        const focus = selection.focus;
        const focusNode = focus.getNode();
        let combinedFormat = 0;

        if (anchor.type === "text") {
          combinedFormat |= anchorNode.getFormat();
        }

        if (focus.type === "text" && !anchorNode.is(focusNode)) {
          combinedFormat |= focusNode.getFormat();
        }

        selection.format = combinedFormat;
      }
    }

    dispatchCommand(editor, SELECTION_CHANGE_COMMAND);
  });
} // This is a work-around is mainly Chrome specific bug where if you select
// the contents of an empty block, you cannot easily unselect anything.
// This results in a tiny selection box that looks buggy/broken. This can
// also help other browsers when selection might "appear" lost, when it
// really isn't.

function onClick(event, editor) {
  updateEditor(editor, () => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;

      if (
        anchor.type === "element" &&
        anchor.offset === 0 &&
        selection.isCollapsed() &&
        $getRoot().getChildrenSize() === 1 &&
        anchor.getNode().getTopLevelElementOrThrow().isEmpty()
      ) {
        const lastSelection = $getPreviousSelection();

        if (lastSelection !== null && selection.is(lastSelection)) {
          getDOMSelection().removeAllRanges();
          selection.dirty = true;
        }
      }
    }

    dispatchCommand(editor, CLICK_COMMAND, event);
  });
}

function $applyTargetRange(selection, event) {
  if (event.getTargetRanges) {
    const targetRange = event.getTargetRanges()[0];

    if (targetRange) {
      selection.applyDOMRange(targetRange);
    }
  }
}

function $canRemoveText(anchorNode, focusNode) {
  return (
    anchorNode !== focusNode ||
    $isElementNode(anchorNode) ||
    $isElementNode(focusNode) ||
    !$isTokenOrInert(anchorNode) ||
    !$isTokenOrInert(focusNode)
  );
}

function onBeforeInput(event, editor) {
  const inputType = event.inputType; // We let the browser do its own thing for composition.

  if (
    inputType === "deleteCompositionText" || // If we're pasting in FF, we shouldn't get this event
    // as the `paste` event should have triggered, unless the
    // user has dom.event.clipboardevents.enabled disabled in
    // about:config. In that case, we need to process the
    // pasted content in the DOM mutation phase.
    (IS_FIREFOX && isFirefoxClipboardEvents())
  ) {
    return;
  } else if (inputType === "insertCompositionText") {
    // This logic handles insertion of text between different
    // format text types. We have to detect a change in type
    // during composition and see if the previous text contains
    // part of the composed text to work out the actual text that
    // we need to insert.
    const composedText = event.data;

    if (composedText) {
      updateEditor(editor, () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor;
          const node = anchor.getNode();
          const prevNode = node.getPreviousSibling();

          if (
            anchor.offset === 0 &&
            $isTextNode(node) &&
            $isTextNode(prevNode) &&
            node.getTextContent() === " " &&
            prevNode.getFormat() !== selection.format
          ) {
            const prevTextContent = prevNode.getTextContent();

            if (composedText.indexOf(prevTextContent) === 0) {
              const insertedText = composedText.slice(prevTextContent.length);
              dispatchCommand(editor, INSERT_TEXT_COMMAND, insertedText);
              setTimeout(() => {
                updateEditor(editor, () => {
                  node.select();
                });
              }, ANDROID_COMPOSITION_LATENCY);
            }
          }
        }
      });
    }

    return;
  }

  updateEditor(editor, () => {
    const selection = $getSelection();

    if (inputType === "deleteContentBackward") {
      if (selection === null) {
        // Use previous selection
        const prevSelection = $getPreviousSelection();

        if (!$isRangeSelection(prevSelection)) {
          return;
        }

        $setSelection(prevSelection.clone());
      } // Used for Android

      $setCompositionKey(null);
      event.preventDefault();
      lastKeyDownTimeStamp = 0;
      dispatchCommand(editor, DELETE_CHARACTER_COMMAND, true); // Fixes an Android bug where selection flickers when backspacing

      setTimeout(() => {
        editor.update(() => {
          $setCompositionKey(null);
        });
      }, ANDROID_COMPOSITION_LATENCY);
      return;
    }

    if (!$isRangeSelection(selection)) {
      return;
    }

    const data = event.data;

    if (
      !selection.dirty &&
      selection.isCollapsed() &&
      !$isRootNode(selection.anchor.getNode())
    ) {
      $applyTargetRange(selection, event);
    }

    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = anchor.getNode();
    const focusNode = focus.getNode();

    if (inputType === "insertText") {
      if (data === "\n") {
        event.preventDefault();
        dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND);
      } else if (data === DOUBLE_LINE_BREAK) {
        event.preventDefault();
        dispatchCommand(editor, INSERT_PARAGRAPH_COMMAND);
      } else if (data == null && event.dataTransfer) {
        // Gets around a Safari text replacement bug.
        const text = event.dataTransfer.getData("text/plain");
        event.preventDefault();
        selection.insertRawText(text);
      } else if (
        data != null &&
        $shouldPreventDefaultAndInsertText(selection, data, true)
      ) {
        event.preventDefault();
        dispatchCommand(editor, INSERT_TEXT_COMMAND, data);
      }

      return;
    } // Prevent the browser from carrying out
    // the input event, so we can control the
    // output.

    event.preventDefault();

    switch (inputType) {
      case "insertFromYank":
      case "insertFromDrop":
      case "insertReplacementText": {
        dispatchCommand(editor, INSERT_TEXT_COMMAND, event);
        break;
      }

      case "insertFromComposition": {
        // This is the end of composition
        $setCompositionKey(null);
        dispatchCommand(editor, INSERT_TEXT_COMMAND, event);
        break;
      }

      case "insertLineBreak": {
        // Used for Android
        $setCompositionKey(null);
        dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND);
        break;
      }

      case "insertParagraph": {
        // Used for Android
        $setCompositionKey(null); // Some browsers do not provide the type "insertLineBreak".
        // So instead, we need to infer it from the keyboard event.

        if (isInsertLineBreak) {
          isInsertLineBreak = false;
          dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND);
        } else {
          dispatchCommand(editor, INSERT_PARAGRAPH_COMMAND);
        }

        break;
      }

      case "insertFromPaste":
      case "insertFromPasteAsQuotation": {
        dispatchCommand(editor, PASTE_COMMAND, event);
        break;
      }

      case "deleteByComposition": {
        if ($canRemoveText(anchorNode, focusNode)) {
          dispatchCommand(editor, REMOVE_TEXT_COMMAND);
        }

        break;
      }

      case "deleteByDrag":
      case "deleteByCut": {
        dispatchCommand(editor, REMOVE_TEXT_COMMAND);
        break;
      }

      case "deleteContent": {
        dispatchCommand(editor, DELETE_CHARACTER_COMMAND, false);
        break;
      }

      case "deleteWordBackward": {
        dispatchCommand(editor, DELETE_WORD_COMMAND, true);
        break;
      }

      case "deleteWordForward": {
        dispatchCommand(editor, DELETE_WORD_COMMAND, false);
        break;
      }

      case "deleteHardLineBackward":
      case "deleteSoftLineBackward": {
        dispatchCommand(editor, DELETE_LINE_COMMAND, true);
        break;
      }

      case "deleteContentForward":
      case "deleteHardLineForward":
      case "deleteSoftLineForward": {
        dispatchCommand(editor, DELETE_LINE_COMMAND, false);
        break;
      }

      case "formatStrikeThrough": {
        dispatchCommand(editor, FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      }

      case "formatBold": {
        dispatchCommand(editor, FORMAT_TEXT_COMMAND, "bold");
        break;
      }

      case "formatItalic": {
        dispatchCommand(editor, FORMAT_TEXT_COMMAND, "italic");
        break;
      }

      case "formatUnderline": {
        dispatchCommand(editor, FORMAT_TEXT_COMMAND, "underline");
        break;
      }

      case "historyUndo": {
        dispatchCommand(editor, UNDO_COMMAND);
        break;
      }

      case "historyRedo": {
        dispatchCommand(editor, REDO_COMMAND);
        break;
      }
    }
  });
}

function onInput(event, editor) {
  // We don't want the onInput to bubble, in the case of nested editors.
  event.stopPropagation();
  updateEditor(editor, () => {
    const selection = $getSelection();
    const data = event.data;

    if (
      data != null &&
      $isRangeSelection(selection) &&
      $shouldPreventDefaultAndInsertText(selection, data, false)
    ) {
      dispatchCommand(editor, INSERT_TEXT_COMMAND, data); // For Android

      if (editor._compositionKey !== null) {
        lastKeyDownTimeStamp = 0;
        $setCompositionKey(null);
      }
    } else {
      $updateSelectedTextFromDOM(editor, null);
    } // Also flush any other mutations that might have occurred
    // since the change.

    $flushMutations$1();
  });
}

function onCompositionStart(event, editor) {
  updateEditor(editor, () => {
    const selection = $getSelection();

    if ($isRangeSelection(selection) && !editor.isComposing()) {
      const anchor = selection.anchor;
      $setCompositionKey(anchor.key);

      if (
        // If it has been 30ms since the last keydown, then we should
        // apply the empty space heuristic.
        event.timeStamp < lastKeyDownTimeStamp + ANDROID_COMPOSITION_LATENCY || // FF has issues around composing multibyte characters, so we also
        // need to invoke the empty space heuristic below.
        (IS_FIREFOX && anchor.type === "element") ||
        !selection.isCollapsed() ||
        selection.anchor.getNode().getFormat() !== selection.format
      ) {
        // We insert an empty space, ready for the composition
        // to get inserted into the new node we create. If
        // we don't do this, Safari will fail on us because
        // there is no text node matching the selection.
        dispatchCommand(editor, INSERT_TEXT_COMMAND, " ");
      }
    }
  });
}

function onCompositionEnd(event, editor) {
  updateEditor(editor, () => {
    const compositionKey = editor._compositionKey;
    $setCompositionKey(null);
    const data = event.data; // Handle termination of composition.

    if (compositionKey !== null && data != null) {
      // It can sometimes move to an adjacent DOM node when backspacing.
      // So check for the empty case.
      if (data === "") {
        const node = $getNodeByKey(compositionKey);
        const textNode = getDOMTextNode(editor.getElementByKey(compositionKey));

        if (textNode !== null && $isTextNode(node)) {
          $updateTextNodeFromDOMContent(
            node,
            textNode.nodeValue,
            null,
            null,
            true
          );
        }

        return;
      } else if (data[data.length - 1] === "\n") {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          // If the last character is a line break, we also need to insert
          // a line break.
          const focus = selection.focus;
          selection.anchor.set(focus.key, focus.offset, focus.type);
          dispatchCommand(editor, KEY_ENTER_COMMAND, null);
          return;
        }
      }
    }

    $updateSelectedTextFromDOM(editor, event);
  });
}

function onKeyDown(event, editor) {
  lastKeyDownTimeStamp = event.timeStamp;

  if (editor.isComposing()) {
    return;
  }

  const { keyCode, shiftKey, ctrlKey, metaKey, altKey } = event;

  if (isMoveForward(keyCode, ctrlKey, shiftKey, altKey, metaKey)) {
    dispatchCommand(editor, KEY_ARROW_RIGHT_COMMAND, event);
  } else if (isMoveBackward(keyCode, ctrlKey, shiftKey, altKey, metaKey)) {
    dispatchCommand(editor, KEY_ARROW_LEFT_COMMAND, event);
  } else if (isMoveUp(keyCode, ctrlKey, shiftKey, altKey, metaKey)) {
    dispatchCommand(editor, KEY_ARROW_UP_COMMAND, event);
  } else if (isMoveDown(keyCode, ctrlKey, shiftKey, altKey, metaKey)) {
    dispatchCommand(editor, KEY_ARROW_DOWN_COMMAND, event);
  } else if (isLineBreak(keyCode, shiftKey)) {
    isInsertLineBreak = true;
    dispatchCommand(editor, KEY_ENTER_COMMAND, event);
  } else if (isOpenLineBreak(keyCode, ctrlKey)) {
    event.preventDefault();
    isInsertLineBreak = true;
    dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, true);
  } else if (isParagraph(keyCode, shiftKey)) {
    isInsertLineBreak = false;
    dispatchCommand(editor, KEY_ENTER_COMMAND, event);
  } else if (isDeleteBackward(keyCode, altKey, metaKey, ctrlKey)) {
    if (isBackspace(keyCode)) {
      dispatchCommand(editor, KEY_BACKSPACE_COMMAND, event);
    } else {
      event.preventDefault();
      dispatchCommand(editor, DELETE_CHARACTER_COMMAND, true);
    }
  } else if (isEscape(keyCode)) {
    dispatchCommand(editor, KEY_ESCAPE_COMMAND, event);
  } else if (isDeleteForward(keyCode, ctrlKey, shiftKey, altKey, metaKey)) {
    if (isDelete(keyCode)) {
      dispatchCommand(editor, KEY_DELETE_COMMAND, event);
    } else {
      event.preventDefault();
      dispatchCommand(editor, DELETE_CHARACTER_COMMAND, false);
    }
  } else if (isDeleteWordBackward(keyCode, altKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, DELETE_WORD_COMMAND, true);
  } else if (isDeleteWordForward(keyCode, altKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, DELETE_WORD_COMMAND, false);
  } else if (isDeleteLineBackward(keyCode, metaKey)) {
    event.preventDefault();
    dispatchCommand(editor, DELETE_LINE_COMMAND, true);
  } else if (isDeleteLineForward(keyCode, metaKey)) {
    event.preventDefault();
    dispatchCommand(editor, DELETE_LINE_COMMAND, false);
  } else if (isBold(keyCode, altKey, metaKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, FORMAT_TEXT_COMMAND, "bold");
  } else if (isUnderline(keyCode, altKey, metaKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, FORMAT_TEXT_COMMAND, "underline");
  } else if (isItalic(keyCode, altKey, metaKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, FORMAT_TEXT_COMMAND, "italic");
  } else if (isTab(keyCode, altKey, ctrlKey, metaKey)) {
    dispatchCommand(editor, KEY_TAB_COMMAND, event);
  } else if (isUndo(keyCode, shiftKey, metaKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, UNDO_COMMAND);
  } else if (isRedo(keyCode, shiftKey, metaKey, ctrlKey)) {
    event.preventDefault();
    dispatchCommand(editor, REDO_COMMAND);
  }

  if (isModifier(ctrlKey, shiftKey, altKey, metaKey)) {
    dispatchCommand(editor, KEY_MODIFIER_COMMAND, event);
  }
}

function getRootElementRemoveHandles(rootElement) {
  // $FlowFixMe: internal field
  let eventHandles = rootElement.__lexicalEventHandles;

  if (eventHandles === undefined) {
    eventHandles = []; // $FlowFixMe: internal field

    rootElement.__lexicalEventHandles = eventHandles;
  }

  return eventHandles;
} // Mapping root editors to their active nested editors, contains nested editors
// mapping only, so if root editor is selected map will have no reference to free up memory

const activeNestedEditorsMap = new Map();

function onDocumentSelectionChange(event) {
  const selection = getDOMSelection();
  const nextActiveEditor = getNearestEditorFromDOMNode(selection.anchorNode);

  if (nextActiveEditor === null) {
    return;
  } // When editor receives selection change event, we're checking if
  // it has any sibling editors (within same parent editor) that were active
  // before, and trigger selection change on it to nullify selection.

  const editors = getEditorsToPropagate(nextActiveEditor);
  const rootEditor = editors[editors.length - 1];
  const rootEditorKey = rootEditor._key;
  const activeNestedEditor = activeNestedEditorsMap.get(rootEditorKey);
  const prevActiveEditor = activeNestedEditor || rootEditor;

  if (prevActiveEditor !== nextActiveEditor) {
    onSelectionChange(selection, prevActiveEditor, false);
  }

  onSelectionChange(selection, nextActiveEditor, true); // If newly selected editor is nested, then add it to the map, clean map otherwise

  if (nextActiveEditor !== rootEditor) {
    activeNestedEditorsMap.set(rootEditorKey, nextActiveEditor);
  } else if (activeNestedEditor) {
    activeNestedEditorsMap.delete(rootEditorKey);
  }
}

function addRootElementEvents(rootElement, editor) {
  // We only want to have a single global selectionchange event handler, shared
  // between all editor instances.
  if (rootElementsRegistered === 0) {
    const doc = rootElement.ownerDocument;
    doc.addEventListener("selectionchange", onDocumentSelectionChange);
  }

  rootElementsRegistered++; // $FlowFixMe: internal field

  rootElement.__lexicalEditor = editor;
  const removeHandles = getRootElementRemoveHandles(rootElement);

  for (let i = 0; i < rootElementEvents.length; i++) {
    const [eventName, onEvent] = rootElementEvents[i];
    const eventHandler =
      typeof onEvent === "function"
        ? (event) => {
            if (!editor.isReadOnly()) {
              onEvent(event, editor);
            }
          }
        : (event) => {
            if (!editor.isReadOnly()) {
              switch (eventName) {
                case "cut":
                  return dispatchCommand(editor, CUT_COMMAND, event);

                case "copy":
                  return dispatchCommand(editor, COPY_COMMAND, event);

                case "paste":
                  return dispatchCommand(editor, PASTE_COMMAND, event);

                case "dragstart":
                  return dispatchCommand(editor, DRAGSTART_COMMAND, event);

                case "dragend":
                  return dispatchCommand(editor, DRAGEND_COMMAND, event);

                case "focus":
                  return dispatchCommand(editor, FOCUS_COMMAND, event);

                case "blur":
                  return dispatchCommand(editor, BLUR_COMMAND, event);

                case "drop":
                  return dispatchCommand(editor, DROP_COMMAND, event);
              }
            }
          };
    rootElement.addEventListener(eventName, eventHandler);
    removeHandles.push(() => {
      rootElement.removeEventListener(eventName, eventHandler);
    });
  }
}
function removeRootElementEvents(rootElement) {
  if (rootElementsRegistered !== 0) {
    rootElementsRegistered--; // We only want to have a single global selectionchange event handler, shared
    // between all editor instances.

    if (rootElementsRegistered === 0) {
      const doc = rootElement.ownerDocument;
      doc.removeEventListener("selectionchange", onDocumentSelectionChange);
    }
  } // $FlowFixMe: internal field

  const editor = rootElement.__lexicalEditor;

  if (editor != null) {
    cleanActiveNestedEditorsMap(editor); // $FlowFixMe: internal field

    rootElement.__lexicalEditor = null;
  }

  const removeHandles = getRootElementRemoveHandles(rootElement);

  for (let i = 0; i < removeHandles.length; i++) {
    removeHandles[i]();
  } // $FlowFixMe: internal field

  rootElement.__lexicalEventHandles = [];
}

function cleanActiveNestedEditorsMap(editor) {
  if (editor._parentEditor !== null) {
    // For nested editor cleanup map if this editor was marked as active
    const editors = getEditorsToPropagate(editor);
    const rootEditor = editors[editors.length - 1];
    const rootEditorKey = rootEditor._key;

    if (activeNestedEditorsMap.get(rootEditorKey) === editor) {
      activeNestedEditorsMap.delete(rootEditorKey);
    }
  } else {
    // For top-level editors cleanup map
    activeNestedEditorsMap.delete(editor._key);
  }
}

function markSelectionChangeFromReconcile() {
  isSelectionChangeFromReconcile = true;
}
function markCollapsedSelectionFormat(format, offset, key, timeStamp) {
  collapsedSelectionFormat = [format, offset, key, timeStamp];
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
let subTreeTextContent = "";
let subTreeDirectionedTextContent = "";
let editorTextContent = "";
let activeEditorConfig;
let activeEditor$1;
let activeEditorNodes;
let treatAllNodesAsDirty = false;
let activeEditorStateReadOnly = false;
let activeMutationListeners;
let activeTextDirection = null;
let activeDirtyElements;
let activeDirtyLeaves;
let activePrevNodeMap;
let activeNextNodeMap;
let activePrevKeyToDOMMap;
let mutatedNodes;

function destroyNode(key, parentDOM) {
  const node = activePrevNodeMap.get(key);

  if (parentDOM !== null) {
    const dom = getPrevElementByKeyOrThrow(key);
    parentDOM.removeChild(dom);
  } // This logic is really important, otherwise we will leak DOM nodes
  // when their corresponding LexicalNodes are removed from the editor state.

  if (!activeNextNodeMap.has(key)) {
    activeEditor$1._keyToDOMMap.delete(key);
  }

  if ($isElementNode(node)) {
    const children = node.__children;
    destroyChildren(children, 0, children.length - 1, null);
  }

  if (node !== undefined) {
    setMutatedNode(
      mutatedNodes,
      activeEditorNodes,
      activeMutationListeners,
      node,
      "destroyed"
    );
  }
}

function destroyChildren(children, _startIndex, endIndex, dom) {
  let startIndex = _startIndex;

  for (; startIndex <= endIndex; ++startIndex) {
    const child = children[startIndex];

    if (child !== undefined) {
      destroyNode(child, dom);
    }
  }
}

function setTextAlign(domStyle, value) {
  domStyle.setProperty("text-align", value);
}

function setElementIndent(dom, indent) {
  dom.style.setProperty(
    "padding-inline-start",
    indent === 0 ? "" : indent * 20 + "px"
  );
}

function setElementFormat(dom, format) {
  const domStyle = dom.style;

  if (format === 0) {
    setTextAlign(domStyle, "");
  } else if (format === IS_ALIGN_LEFT) {
    setTextAlign(domStyle, "left");
  } else if (format === IS_ALIGN_CENTER) {
    setTextAlign(domStyle, "center");
  } else if (format === IS_ALIGN_RIGHT) {
    setTextAlign(domStyle, "right");
  } else if (format === IS_ALIGN_JUSTIFY) {
    setTextAlign(domStyle, "justify");
  }
}

function createNode(key, parentDOM, insertDOM) {
  const node = activeNextNodeMap.get(key);

  if (node === undefined) {
    {
      throw Error(`createNode: node does not exist in nodeMap`);
    }
  }

  const dom = node.createDOM(activeEditorConfig, activeEditor$1);
  storeDOMWithKey(key, dom, activeEditor$1); // This helps preserve the text, and stops spell check tools from
  // merging or break the spans (which happens if they are missing
  // this attribute).

  if ($isTextNode(node)) {
    dom.setAttribute("data-lexical-text", "true");
  } else if ($isDecoratorNode(node)) {
    dom.setAttribute("data-lexical-decorator", "true");
  }

  if ($isElementNode(node)) {
    const indent = node.__indent;

    if (indent !== 0) {
      setElementIndent(dom, indent);
    }

    const children = node.__children;
    const childrenLength = children.length;

    if (childrenLength !== 0) {
      const endIndex = childrenLength - 1;
      createChildrenWithDirection(children, endIndex, node, dom);
    }

    const format = node.__format;

    if (format !== 0) {
      setElementFormat(dom, format);
    }

    reconcileElementTerminatingLineBreak(null, children, dom);

    if ($textContentRequiresDoubleLinebreakAtEnd(node)) {
      subTreeTextContent += DOUBLE_LINE_BREAK;
      editorTextContent += DOUBLE_LINE_BREAK;
    }
  } else {
    const text = node.getTextContent();

    if ($isDecoratorNode(node)) {
      const decorator = node.decorate(activeEditor$1);

      if (decorator !== null) {
        reconcileDecorator(key, decorator);
      } // Decorators are always non editable

      dom.contentEditable = "false";
    } else if ($isTextNode(node)) {
      if (!node.isDirectionless()) {
        subTreeDirectionedTextContent += text;
      }

      if (node.isInert()) {
        const domStyle = dom.style;
        domStyle.pointerEvents = "none";
        domStyle.userSelect = "none";
        dom.contentEditable = "false"; // To support Safari

        domStyle.setProperty("-webkit-user-select", "none");
      }
    }

    subTreeTextContent += text;
    editorTextContent += text;
  }

  if (parentDOM !== null) {
    if (insertDOM != null) {
      parentDOM.insertBefore(dom, insertDOM);
    } else {
      // $FlowFixMe: internal field
      const possibleLineBreak = parentDOM.__lexicalLineBreak;

      if (possibleLineBreak != null) {
        parentDOM.insertBefore(dom, possibleLineBreak);
      } else {
        parentDOM.appendChild(dom);
      }
    }
  }

  {
    // Freeze the node in DEV to prevent accidental mutations
    Object.freeze(node);
  }

  setMutatedNode(
    mutatedNodes,
    activeEditorNodes,
    activeMutationListeners,
    node,
    "created"
  );
  return dom;
}

function createChildrenWithDirection(children, endIndex, element, dom) {
  const previousSubTreeDirectionedTextContent = subTreeDirectionedTextContent;
  subTreeDirectionedTextContent = "";
  createChildren(children, 0, endIndex, dom, null);
  reconcileBlockDirection(element, dom);
  subTreeDirectionedTextContent = previousSubTreeDirectionedTextContent;
}

function createChildren(children, _startIndex, endIndex, dom, insertDOM) {
  const previousSubTreeTextContent = subTreeTextContent;
  subTreeTextContent = "";
  let startIndex = _startIndex;

  for (; startIndex <= endIndex; ++startIndex) {
    createNode(children[startIndex], dom, insertDOM);
  } // $FlowFixMe: internal field

  dom.__lexicalTextContent = subTreeTextContent;
  subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
}

function isLastChildLineBreakOrDecorator(children, nodeMap) {
  const childKey = children[children.length - 1];
  const node = nodeMap.get(childKey);
  return $isLineBreakNode(node) || $isDecoratorNode(node);
} // If we end an element with a LinkBreakNode, then we need to add an additonal <br>

function reconcileElementTerminatingLineBreak(prevChildren, nextChildren, dom) {
  const prevLineBreak =
    prevChildren !== null &&
    (prevChildren.length === 0 ||
      isLastChildLineBreakOrDecorator(prevChildren, activePrevNodeMap));
  const nextLineBreak =
    nextChildren !== null &&
    (nextChildren.length === 0 ||
      isLastChildLineBreakOrDecorator(nextChildren, activeNextNodeMap));

  if (prevLineBreak) {
    if (!nextLineBreak) {
      // $FlowFixMe: internal field
      const element = dom.__lexicalLineBreak;

      if (element != null) {
        dom.removeChild(element);
      } // $FlowFixMe: internal field

      dom.__lexicalLineBreak = null;
    }
  } else if (nextLineBreak) {
    const element = document.createElement("br"); // $FlowFixMe: internal field

    dom.__lexicalLineBreak = element;
    dom.appendChild(element);
  }
}

function reconcileBlockDirection(element, dom) {
  const previousSubTreeDirectionTextContent = dom.__lexicalDirTextContent; // $FlowFixMe: internal field // $FlowFixMe: internal field

  const previousDirection = dom.__lexicalDir;

  if (
    previousSubTreeDirectionTextContent !== subTreeDirectionedTextContent ||
    previousDirection !== activeTextDirection
  ) {
    const hasEmptyDirectionedTextContent = subTreeDirectionedTextContent === "";
    const direction = hasEmptyDirectionedTextContent
      ? activeTextDirection
      : getTextDirection(subTreeDirectionedTextContent);

    if (direction !== previousDirection) {
      const classList = dom.classList;
      const theme = activeEditorConfig.theme;
      let previousDirectionTheme =
        previousDirection !== null ? theme[previousDirection] : undefined;
      let nextDirectionTheme =
        direction !== null ? theme[direction] : undefined; // Remove the old theme classes if they exist

      if (previousDirectionTheme !== undefined) {
        if (typeof previousDirectionTheme === "string") {
          const classNamesArr = previousDirectionTheme.split(" "); // $FlowFixMe: intentional

          previousDirectionTheme = theme[previousDirection] = classNamesArr;
        } // $FlowFixMe: intentional

        classList.remove(...previousDirectionTheme);
      }

      if (
        direction === null ||
        (hasEmptyDirectionedTextContent && direction === "ltr")
      ) {
        // Remove direction
        dom.removeAttribute("dir");
      } else {
        // Apply the new theme classes if they exist
        if (nextDirectionTheme !== undefined) {
          if (typeof nextDirectionTheme === "string") {
            const classNamesArr = nextDirectionTheme.split(" "); // $FlowFixMe: intentional

            nextDirectionTheme = theme[direction] = classNamesArr;
          }

          classList.add(...nextDirectionTheme);
        } // Update direction

        dom.dir = direction;
      }

      if (!activeEditorStateReadOnly) {
        const writableNode = element.getWritable();
        writableNode.__dir = direction;
      }
    }

    activeTextDirection = direction; // $FlowFixMe: internal field

    dom.__lexicalDirTextContent = subTreeDirectionedTextContent; // $FlowFixMe: internal field

    dom.__lexicalDir = direction;
  }
}

function reconcileChildrenWithDirection(
  prevChildren,
  nextChildren,
  element,
  dom
) {
  const previousSubTreeDirectionTextContent = subTreeDirectionedTextContent;
  subTreeDirectionedTextContent = "";
  reconcileChildren(element, prevChildren, nextChildren, dom);
  reconcileBlockDirection(element, dom);
  subTreeDirectionedTextContent = previousSubTreeDirectionTextContent;
}

function reconcileChildren(element, prevChildren, nextChildren, dom) {
  const previousSubTreeTextContent = subTreeTextContent;
  subTreeTextContent = "";
  const prevChildrenLength = prevChildren.length;
  const nextChildrenLength = nextChildren.length;

  if (prevChildrenLength === 1 && nextChildrenLength === 1) {
    const prevChildKey = prevChildren[0];
    const nextChildKey = nextChildren[0];

    if (prevChildKey === nextChildKey) {
      reconcileNode(prevChildKey, dom);
    } else {
      const lastDOM = getPrevElementByKeyOrThrow(prevChildKey);
      const replacementDOM = createNode(nextChildKey, null, null);
      dom.replaceChild(replacementDOM, lastDOM);
      destroyNode(prevChildKey, null);
    }
  } else if (prevChildrenLength === 0) {
    if (nextChildrenLength !== 0) {
      createChildren(nextChildren, 0, nextChildrenLength - 1, dom, null);
    }
  } else if (nextChildrenLength === 0) {
    if (prevChildrenLength !== 0) {
      // $FlowFixMe: internal field
      const lexicalLineBreak = dom.__lexicalLineBreak;
      const canUseFastPath = lexicalLineBreak == null;
      destroyChildren(
        prevChildren,
        0,
        prevChildrenLength - 1,
        canUseFastPath ? null : dom
      );

      if (canUseFastPath) {
        // Fast path for removing DOM nodes
        dom.textContent = "";
      }
    }
  } else {
    reconcileNodeChildren(
      prevChildren,
      nextChildren,
      prevChildrenLength,
      nextChildrenLength,
      element,
      dom
    );
  }

  if ($textContentRequiresDoubleLinebreakAtEnd(element)) {
    subTreeTextContent += DOUBLE_LINE_BREAK;
  } // $FlowFixMe: internal field

  dom.__lexicalTextContent = subTreeTextContent;
  subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
}

function reconcileNode(key, parentDOM) {
  const prevNode = activePrevNodeMap.get(key);
  let nextNode = activeNextNodeMap.get(key);

  if (prevNode === undefined || nextNode === undefined) {
    {
      throw Error(
        `reconcileNode: prevNode or nextNode does not exist in nodeMap`
      );
    }
  }

  const isDirty =
    treatAllNodesAsDirty ||
    activeDirtyLeaves.has(key) ||
    activeDirtyElements.has(key);
  const dom = getElementByKeyOrThrow(activeEditor$1, key);

  if (prevNode === nextNode && !isDirty) {
    if ($isElementNode(prevNode)) {
      // $FlowFixMe: internal field
      const previousSubTreeTextContent = dom.__lexicalTextContent;

      if (previousSubTreeTextContent !== undefined) {
        subTreeTextContent += previousSubTreeTextContent;
        editorTextContent += previousSubTreeTextContent;
      } // $FlowFixMe: internal field

      const previousSubTreeDirectionTextContent = dom.__lexicalDirTextContent;

      if (previousSubTreeDirectionTextContent !== undefined) {
        subTreeDirectionedTextContent += previousSubTreeDirectionTextContent;
      }
    } else {
      const text = prevNode.getTextContent();

      if ($isTextNode(prevNode) && !prevNode.isDirectionless()) {
        subTreeDirectionedTextContent += text;
      }

      editorTextContent += text;
      subTreeTextContent += text;
    }

    return dom;
  }

  if (prevNode !== nextNode && isDirty) {
    setMutatedNode(
      mutatedNodes,
      activeEditorNodes,
      activeMutationListeners,
      nextNode,
      "updated"
    );
  } // Update node. If it returns true, we need to unmount and re-create the node

  if (nextNode.updateDOM(prevNode, dom, activeEditorConfig)) {
    const replacementDOM = createNode(key, null, null);

    if (parentDOM === null) {
      {
        throw Error(`reconcileNode: parentDOM is null`);
      }
    }

    parentDOM.replaceChild(replacementDOM, dom);
    destroyNode(key, null);
    return replacementDOM;
  }

  if ($isElementNode(prevNode) && $isElementNode(nextNode)) {
    // Reconcile element children
    const nextIndent = nextNode.__indent;

    if (nextIndent !== prevNode.__indent) {
      setElementIndent(dom, nextIndent);
    }

    const nextFormat = nextNode.__format;

    if (nextFormat !== prevNode.__format) {
      setElementFormat(dom, nextFormat);
    }

    const prevChildren = prevNode.__children;
    const nextChildren = nextNode.__children;
    const childrenAreDifferent = prevChildren !== nextChildren;

    if (childrenAreDifferent || isDirty) {
      reconcileChildrenWithDirection(prevChildren, nextChildren, nextNode, dom);

      if (!$isRootNode(nextNode)) {
        reconcileElementTerminatingLineBreak(prevChildren, nextChildren, dom);
      }
    }

    if ($textContentRequiresDoubleLinebreakAtEnd(nextNode)) {
      subTreeTextContent += DOUBLE_LINE_BREAK;
      editorTextContent += DOUBLE_LINE_BREAK;
    }
  } else {
    const text = nextNode.getTextContent();

    if ($isDecoratorNode(nextNode)) {
      const decorator = nextNode.decorate(activeEditor$1);

      if (decorator !== null) {
        reconcileDecorator(key, decorator);
      }

      subTreeTextContent += text;
      editorTextContent += text;
    } else if ($isTextNode(nextNode) && !nextNode.isDirectionless()) {
      // Handle text content, for LTR, LTR cases.
      subTreeDirectionedTextContent += text;
    }

    subTreeTextContent += text;
    editorTextContent += text;
  }

  if (
    !activeEditorStateReadOnly &&
    $isRootNode(nextNode) &&
    nextNode.__cachedText !== editorTextContent
  ) {
    // Cache the latest text content.
    nextNode = nextNode.getWritable();
    nextNode.__cachedText = editorTextContent;
  }

  {
    // Freeze the node in DEV to prevent accidental mutations
    Object.freeze(nextNode);
  }

  return dom;
}

function reconcileDecorator(key, decorator) {
  let pendingDecorators = activeEditor$1._pendingDecorators;
  const currentDecorators = activeEditor$1._decorators;

  if (pendingDecorators === null) {
    if (currentDecorators[key] === decorator) {
      return;
    }

    pendingDecorators = cloneDecorators(activeEditor$1);
  }

  pendingDecorators[key] = decorator;
}

function getFirstChild(element) {
  // $FlowFixMe: firstChild is always null or a Node
  return element.firstChild;
}

function getNextSibling(element) {
  // $FlowFixMe: nextSibling is always null or a Node
  return element.nextSibling;
}

function reconcileNodeChildren(
  prevChildren,
  nextChildren,
  prevChildrenLength,
  nextChildrenLength,
  element,
  dom
) {
  const prevEndIndex = prevChildrenLength - 1;
  const nextEndIndex = nextChildrenLength - 1;
  let prevChildrenSet;
  let nextChildrenSet;
  let siblingDOM = getFirstChild(dom);
  let prevIndex = 0;
  let nextIndex = 0;

  while (prevIndex <= prevEndIndex && nextIndex <= nextEndIndex) {
    const prevKey = prevChildren[prevIndex];
    const nextKey = nextChildren[nextIndex];

    if (prevKey === nextKey) {
      siblingDOM = getNextSibling(reconcileNode(nextKey, dom));
      prevIndex++;
      nextIndex++;
    } else {
      if (prevChildrenSet === undefined) {
        prevChildrenSet = new Set(prevChildren);
      }

      if (nextChildrenSet === undefined) {
        nextChildrenSet = new Set(nextChildren);
      }

      const nextHasPrevKey = nextChildrenSet.has(prevKey);
      const prevHasNextKey = prevChildrenSet.has(nextKey);

      if (!nextHasPrevKey) {
        // Remove prev
        siblingDOM = getNextSibling(getPrevElementByKeyOrThrow(prevKey));
        destroyNode(prevKey, dom);
        prevIndex++;
      } else if (!prevHasNextKey) {
        // Create next
        createNode(nextKey, dom, siblingDOM);
        nextIndex++;
      } else {
        // Move next
        const childDOM = getElementByKeyOrThrow(activeEditor$1, nextKey);

        if (childDOM === siblingDOM) {
          siblingDOM = getNextSibling(reconcileNode(nextKey, dom));
        } else {
          if (siblingDOM != null) {
            dom.insertBefore(childDOM, siblingDOM);
          } else {
            dom.appendChild(childDOM);
          }

          reconcileNode(nextKey, dom);
        }

        prevIndex++;
        nextIndex++;
      }
    }
  }

  const appendNewChildren = prevIndex > prevEndIndex;
  const removeOldChildren = nextIndex > nextEndIndex;

  if (appendNewChildren && !removeOldChildren) {
    const previousNode = nextChildren[nextEndIndex + 1];
    const insertDOM =
      previousNode === undefined
        ? null
        : activeEditor$1.getElementByKey(previousNode);
    createChildren(nextChildren, nextIndex, nextEndIndex, dom, insertDOM);
  } else if (removeOldChildren && !appendNewChildren) {
    destroyChildren(prevChildren, prevIndex, prevEndIndex, dom);
  }
}

function reconcileRoot(
  prevEditorState,
  nextEditorState,
  editor,
  dirtyType,
  dirtyElements,
  dirtyLeaves
) {
  subTreeTextContent = "";
  editorTextContent = "";
  subTreeDirectionedTextContent = ""; // Rather than pass around a load of arguments through the stack recursively
  // we instead set them as bindings within the scope of the module.

  treatAllNodesAsDirty = dirtyType === FULL_RECONCILE;
  activeTextDirection = null;
  activeEditor$1 = editor;
  activeEditorConfig = editor._config;
  activeEditorNodes = editor._nodes;
  activeMutationListeners = activeEditor$1._listeners.mutation;
  activeDirtyElements = dirtyElements;
  activeDirtyLeaves = dirtyLeaves;
  activePrevNodeMap = prevEditorState._nodeMap;
  activeNextNodeMap = nextEditorState._nodeMap;
  activeEditorStateReadOnly = nextEditorState._readOnly;
  activePrevKeyToDOMMap = new Map(editor._keyToDOMMap);
  const currentMutatedNodes = new Map();
  mutatedNodes = currentMutatedNodes;
  reconcileNode("root", null); // We don't want a bunch of void checks throughout the scope
  // so instead we make it seem that these values are always set.
  // We also want to make sure we clear them down, otherwise we
  // can leak memory.
  // $FlowFixMe

  activeEditor$1 = undefined; // $FlowFixMe

  activeEditorNodes = undefined; // $FlowFixMe

  activeDirtyElements = undefined; // $FlowFixMe

  activeDirtyLeaves = undefined; // $FlowFixMe

  activePrevNodeMap = undefined; // $FlowFixMe

  activeNextNodeMap = undefined; // $FlowFixMe

  activeEditorConfig = undefined; // $FlowFixMe

  activePrevKeyToDOMMap = undefined; // $FlowFixMe

  mutatedNodes = undefined;
  return currentMutatedNodes;
}

function updateEditorState(
  rootElement,
  currentEditorState,
  pendingEditorState,
  currentSelection,
  pendingSelection,
  needsUpdate,
  editor
) {
  const observer = editor._observer;
  let reconcileMutatedNodes = null;

  if (needsUpdate && observer !== null) {
    const dirtyType = editor._dirtyType;
    const dirtyElements = editor._dirtyElements;
    const dirtyLeaves = editor._dirtyLeaves;
    observer.disconnect();

    try {
      reconcileMutatedNodes = reconcileRoot(
        currentEditorState,
        pendingEditorState,
        editor,
        dirtyType,
        dirtyElements,
        dirtyLeaves
      );
    } finally {
      observer.observe(rootElement, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }

  const domSelection = getDOMSelection();

  if (
    !editor._readOnly &&
    domSelection !== null &&
    (needsUpdate || pendingSelection === null || pendingSelection.dirty)
  ) {
    reconcileSelection(
      currentSelection,
      pendingSelection,
      editor,
      domSelection
    );
  }

  return reconcileMutatedNodes;
}

function scrollIntoViewIfNeeded(editor, node, rootElement) {
  const element = node.nodeType === DOM_TEXT_TYPE ? node.parentNode : node; // $FlowFixMe: this is valid, as we are checking the nodeType

  if (element !== null) {
    const rect = element.getBoundingClientRect();

    if (rect.bottom > window.innerHeight) {
      element.scrollIntoView(false);
    } else if (rect.top < 0) {
      element.scrollIntoView();
    } else if (rootElement) {
      const rootRect = rootElement.getBoundingClientRect();

      if (rect.bottom > rootRect.bottom) {
        element.scrollIntoView(false);
      } else if (rect.top < rootRect.top) {
        element.scrollIntoView();
      }
    }

    editor._updateTags.add("scroll-into-view");
  }
}

function reconcileSelection(
  prevSelection,
  nextSelection,
  editor,
  domSelection
) {
  const anchorDOMNode = domSelection.anchorNode;
  const focusDOMNode = domSelection.focusNode;
  const anchorOffset = domSelection.anchorOffset;
  const focusOffset = domSelection.focusOffset;
  const activeElement = document.activeElement;
  const rootElement = editor._rootElement; // TODO: make this not hard-coded, and add another config option
  // that makes this configurable.

  if (
    editor._updateTags.has("collaboration") &&
    activeElement !== rootElement
  ) {
    return;
  }

  if (!$isRangeSelection(nextSelection)) {
    // We don't remove selection if the prevSelection is null because
    // of editor.setRootElement(). If this occurs on init when the
    // editor is already focused, then this can cause the editor to
    // lose focus.
    if (
      prevSelection !== null &&
      isSelectionWithinEditor(editor, anchorDOMNode, focusDOMNode)
    ) {
      domSelection.removeAllRanges();
    }

    return;
  }

  const anchor = nextSelection.anchor;
  const focus = nextSelection.focus;

  {
    // Freeze the selection in DEV to prevent accidental mutations
    Object.freeze(anchor);
    Object.freeze(focus);
    Object.freeze(nextSelection);
  }

  const anchorKey = anchor.key;
  const focusKey = focus.key;
  const anchorDOM = getElementByKeyOrThrow(editor, anchorKey);
  const focusDOM = getElementByKeyOrThrow(editor, focusKey);
  const nextAnchorOffset = anchor.offset;
  const nextFocusOffset = focus.offset;
  const nextFormat = nextSelection.format;
  const isCollapsed = nextSelection.isCollapsed();
  let nextAnchorNode = anchorDOM;
  let nextFocusNode = focusDOM;
  let anchorFormatChanged = false;

  if (anchor.type === "text") {
    nextAnchorNode = getDOMTextNode(anchorDOM);
    anchorFormatChanged = anchor.getNode().getFormat() !== nextFormat;
  }

  if (focus.type === "text") {
    nextFocusNode = getDOMTextNode(focusDOM);
  } // If we can't get an underlying text node for selection, then
  // we should avoid setting selection to something incorrect.

  if (nextAnchorNode === null || nextFocusNode === null) {
    return;
  }

  if (
    isCollapsed &&
    (prevSelection === null ||
      anchorFormatChanged ||
      prevSelection.format !== nextFormat)
  ) {
    markCollapsedSelectionFormat(
      nextFormat,
      nextAnchorOffset,
      anchorKey,
      performance.now()
    );
  } // Diff against the native DOM selection to ensure we don't do
  // an unnecessary selection update. We also skip this check if
  // we're moving selection to within an element, as this can
  // sometimes be problematic around scrolling.

  if (
    anchorOffset === nextAnchorOffset &&
    focusOffset === nextFocusOffset &&
    anchorDOMNode === nextAnchorNode &&
    focusDOMNode === nextFocusNode && // Badly interpreted range selection when collapsed - #1482
    !(domSelection.type === "Range" && isCollapsed)
  ) {
    // If the root element does not have focus, ensure it has focus
    if (
      rootElement !== null &&
      (activeElement === null || !rootElement.contains(activeElement))
    ) {
      rootElement.focus({
        preventScroll: true,
      });
    } // In Safari/iOS if we have selection on an element, then we also
    // need to additionally set the DOM selection, otherwise a selectionchange
    // event will not fire.

    if (!(IS_IOS || IS_SAFARI) || anchor.type !== "element") {
      return;
    }
  } // Apply the updated selection to the DOM. Note: this will trigger
  // a "selectionchange" event, although it will be asynchronous.

  try {
    domSelection.setBaseAndExtent(
      nextAnchorNode,
      nextAnchorOffset,
      nextFocusNode,
      nextFocusOffset
    );

    if (nextSelection.isCollapsed() && rootElement === activeElement) {
      scrollIntoViewIfNeeded(editor, nextAnchorNode, rootElement);
    }

    markSelectionChangeFromReconcile();
  } catch (error) {
    // If we encounter an error, continue. This can sometimes
    // occur with FF and there's no good reason as to why it
    // should happen.
  }
}

function storeDOMWithKey(key, dom, editor) {
  const keyToDOMMap = editor._keyToDOMMap; // $FlowFixMe: internal field

  dom["__lexicalKey_" + editor._key] = key;
  keyToDOMMap.set(key, dom);
}

function getPrevElementByKeyOrThrow(key) {
  const element = activePrevKeyToDOMMap.get(key);

  if (element === undefined) {
    {
      throw Error(
        `Reconciliation: could not find DOM element for node key "${key}"`
      );
    }
  }

  return element;
}

function getElementByKeyOrThrow(editor, key) {
  const element = editor._keyToDOMMap.get(key);

  if (element === undefined) {
    {
      throw Error(
        `Reconciliation: could not find DOM element for node key "${key}"`
      );
    }
  }

  return element;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
let activeEditorState = null;
let activeEditor = null;
let isReadOnlyMode = false;
let isAttemptingToRecoverFromReconcilerError = false;
let infiniteTransformCount = 0;
function isCurrentlyReadOnlyMode() {
  return isReadOnlyMode;
}
function errorOnReadOnly() {
  if (isReadOnlyMode) {
    {
      throw Error(`Cannot use method in read-only mode.`);
    }
  }
}
function errorOnInfiniteTransforms() {
  if (infiniteTransformCount > 99) {
    {
      throw Error(
        `One or more transforms are endlessly triggering additional transforms. May have encountered infinite recursion caused by transforms that have their preconditions too lose and/or conflict with each other.`
      );
    }
  }
}
function getActiveEditorState() {
  if (activeEditorState === null) {
    {
      throw Error(
        `Unable to find an active editor state. State helpers or node methods can only be used synchronously during the callback of editor.update() or editorState.read().`
      );
    }
  }

  return activeEditorState;
}
function getActiveEditor() {
  if (activeEditor === null) {
    {
      throw Error(
        `Unable to find an active editor. This method can only be used synchronously during the callback of editor.update().`
      );
    }
  }

  return activeEditor;
}
function $applyTransforms(editor, node, transformsCache) {
  const type = node.__type;
  const registeredNode = getRegisteredNodeOrThrow(editor, type);
  let transformsArr = transformsCache.get(type);

  if (transformsArr === undefined) {
    transformsArr = Array.from(registeredNode.transforms);
    transformsCache.set(type, transformsArr);
  }

  const transformsArrLength = transformsArr.length;

  for (let i = 0; i < transformsArrLength; i++) {
    transformsArr[i](node);

    if (!node.isAttached()) {
      break;
    }
  }
}

function $isNodeValidForTransform(node, compositionKey) {
  return (
    node !== undefined && // We don't want to transform nodes being composed
    node.__key !== compositionKey &&
    node.isAttached()
  );
}

function $normalizeAllDirtyTextNodes(editorState, editor) {
  const dirtyLeaves = editor._dirtyLeaves;
  const nodeMap = editorState._nodeMap;

  for (const nodeKey of dirtyLeaves) {
    const node = nodeMap.get(nodeKey);

    if (
      $isTextNode(node) &&
      node.isAttached() &&
      node.isSimpleText() &&
      !node.isUnmergeable()
    ) {
      $normalizeTextNode(node);
    }
  }
}
/**
 * Transform heuristic:
 * 1. We transform leaves first. If transforms generate additional dirty nodes we repeat step 1.
 * The reasoning behind this is that marking a leaf as dirty marks all its parent elements as dirty too.
 * 2. We transform elements. If element transforms generate additional dirty nodes we repeat step 1.
 * If element transforms only generate additional dirty elements we only repeat step 2.
 *
 * Note that to keep track of newly dirty nodes and subtress we leverage the editor._dirtyNodes and
 * editor._subtrees which we reset in every loop.
 */

function $applyAllTransforms(editorState, editor) {
  const dirtyLeaves = editor._dirtyLeaves;
  const dirtyElements = editor._dirtyElements;
  const nodeMap = editorState._nodeMap;
  const compositionKey = $getCompositionKey();
  const transformsCache = new Map();
  let untransformedDirtyLeaves = dirtyLeaves;
  let untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
  let untransformedDirtyElements = dirtyElements;
  let untransformedDirtyElementsLength = untransformedDirtyElements.size;

  while (
    untransformedDirtyLeavesLength > 0 ||
    untransformedDirtyElementsLength > 0
  ) {
    if (untransformedDirtyLeavesLength > 0) {
      // We leverage editor._dirtyLeaves to track the new dirty leaves after the transforms
      editor._dirtyLeaves = new Set();

      for (const nodeKey of untransformedDirtyLeaves) {
        const node = nodeMap.get(nodeKey);

        if (
          $isTextNode(node) &&
          node.isAttached() &&
          node.isSimpleText() &&
          !node.isUnmergeable()
        ) {
          $normalizeTextNode(node);
        }

        if (
          node !== undefined &&
          $isNodeValidForTransform(node, compositionKey)
        ) {
          $applyTransforms(editor, node, transformsCache);
        }

        dirtyLeaves.add(nodeKey);
      }

      untransformedDirtyLeaves = editor._dirtyLeaves;
      untransformedDirtyLeavesLength = untransformedDirtyLeaves.size; // We want to prioritize node transforms over element transforms

      if (untransformedDirtyLeavesLength > 0) {
        infiniteTransformCount++;
        continue;
      }
    } // All dirty leaves have been processed. Let's do elements!
    // We have previously processed dirty leaves, so let's restart the editor leaves Set to track
    // new ones caused by element transforms

    editor._dirtyLeaves = new Set();
    editor._dirtyElements = new Map();

    for (const currentUntransformedDirtyElement of untransformedDirtyElements) {
      const nodeKey = currentUntransformedDirtyElement[0];
      const intentionallyMarkedAsDirty = currentUntransformedDirtyElement[1];

      if (nodeKey === "root" || !intentionallyMarkedAsDirty) {
        continue;
      }

      const node = nodeMap.get(nodeKey);

      if (
        node !== undefined &&
        $isNodeValidForTransform(node, compositionKey)
      ) {
        $applyTransforms(editor, node, transformsCache);
      }

      dirtyElements.set(nodeKey, intentionallyMarkedAsDirty);
    }

    untransformedDirtyLeaves = editor._dirtyLeaves;
    untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
    untransformedDirtyElements = editor._dirtyElements;
    untransformedDirtyElementsLength = untransformedDirtyElements.size;
    infiniteTransformCount++;
  }

  editor._dirtyLeaves = dirtyLeaves;
  editor._dirtyElements = dirtyElements;
}

function parseEditorState(parsedEditorState, editor) {
  const nodeMap = new Map();
  const editorState = new EditorState(nodeMap);
  const nodeParserState = {
    originalSelection: parsedEditorState._selection,
  };
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  activeEditorState = editorState;
  isReadOnlyMode = false;
  activeEditor = editor;

  try {
    const parsedNodeMap = new Map(parsedEditorState._nodeMap); // $FlowFixMe: root always exists in Map

    const parsedRoot = parsedNodeMap.get("root");
    internalCreateNodeFromParse(
      parsedRoot,
      parsedNodeMap,
      editor,
      null,
      /* parentKey */
      nodeParserState
    );
  } finally {
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
  }

  editorState._selection = internalCreateSelectionFromParse(
    nodeParserState.remappedSelection || nodeParserState.originalSelection
  );
  return editorState;
} // This technically isn't an update but given we need
// exposure to the module's active bindings, we have this
// function here

function readEditorState(editorState, callbackFn) {
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  activeEditorState = editorState;
  isReadOnlyMode = true;
  activeEditor = null;

  try {
    return callbackFn();
  } finally {
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
  }
}

function handleDEVOnlyPendingUpdateGuarantees(pendingEditorState) {
  // Given we can't Object.freeze the nodeMap as it's a Map,
  // we instead replace its set, clear and delete methods.
  const nodeMap = pendingEditorState._nodeMap; // $FlowFixMe: this is allowed

  nodeMap.set = () => {
    throw new Error("Cannot call set() on a frozen Lexical node map");
  }; // $FlowFixMe: this is allowed

  nodeMap.clear = () => {
    throw new Error("Cannot call clear() on a frozen Lexical node map");
  }; // $FlowFixMe: this is allowed

  nodeMap.delete = () => {
    throw new Error("Cannot call delete() on a frozen Lexical node map");
  };
}

function commitPendingUpdates(editor) {
  const pendingEditorState = editor._pendingEditorState;
  const rootElement = editor._rootElement;

  if (rootElement === null || pendingEditorState === null) {
    return;
  }

  const currentEditorState = editor._editorState;
  const currentSelection = currentEditorState._selection;
  const pendingSelection = pendingEditorState._selection;
  const needsUpdate = editor._dirtyType !== NO_DIRTY_NODES;
  editor._pendingEditorState = null;
  editor._editorState = pendingEditorState;
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  const previouslyUpdating = editor._updating;
  activeEditor = editor;
  activeEditorState = pendingEditorState;
  isReadOnlyMode = false; // We don't want updates to sync block the reconcilation.

  editor._updating = true;

  try {
    const mutatedNodes = updateEditorState(
      rootElement,
      currentEditorState,
      pendingEditorState,
      currentSelection,
      pendingSelection,
      needsUpdate,
      editor
    );

    if (mutatedNodes !== null) {
      triggerMutationListeners(
        editor,
        currentEditorState,
        pendingEditorState,
        mutatedNodes
      );
    }
  } catch (error) {
    // Report errors
    editor._onError(error); // Reset editor and restore incoming editor state to the DOM

    if (!isAttemptingToRecoverFromReconcilerError) {
      resetEditor(editor, null, rootElement, pendingEditorState);
      initMutationObserver(editor);
      editor._dirtyType = FULL_RECONCILE;
      isAttemptingToRecoverFromReconcilerError = true;
      commitPendingUpdates(editor);
      isAttemptingToRecoverFromReconcilerError = false;
    }

    return;
  } finally {
    editor._updating = previouslyUpdating;
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
  }

  pendingEditorState._readOnly = true;

  {
    handleDEVOnlyPendingUpdateGuarantees(pendingEditorState);
  }

  const dirtyLeaves = editor._dirtyLeaves;
  const dirtyElements = editor._dirtyElements;
  const normalizedNodes = editor._normalizedNodes;
  const tags = editor._updateTags;

  if (needsUpdate) {
    editor._dirtyType = NO_DIRTY_NODES;

    editor._cloneNotNeeded.clear();

    editor._dirtyLeaves = new Set();
    editor._dirtyElements = new Map();
    editor._normalizedNodes = new Set();
    editor._updateTags = new Set();
  }

  $garbageCollectDetachedDecorators(editor, pendingEditorState);
  const pendingDecorators = editor._pendingDecorators;

  if (pendingDecorators !== null) {
    editor._decorators = pendingDecorators;
    editor._pendingDecorators = null;
    triggerListeners("decorator", editor, true, pendingDecorators);
  }

  triggerTextContentListeners(editor, currentEditorState, pendingEditorState);
  triggerListeners("update", editor, true, {
    dirtyElements,
    dirtyLeaves,
    editorState: pendingEditorState,
    normalizedNodes,
    prevEditorState: currentEditorState,
    tags,
  });
  triggerDeferredUpdateCallbacks(editor);
  triggerEnqueuedUpdates(editor);
}

function triggerTextContentListeners(
  editor,
  currentEditorState,
  pendingEditorState
) {
  const currentTextContent = getEditorStateTextContent(currentEditorState);
  const latestTextContent = getEditorStateTextContent(pendingEditorState);

  if (currentTextContent !== latestTextContent) {
    triggerListeners("textcontent", editor, true, latestTextContent);
  }
}

function triggerMutationListeners(
  editor,
  currentEditorState,
  pendingEditorState,
  mutatedNodes
) {
  const listeners = editor._listeners.mutation;
  listeners.forEach((klass, listener) => {
    const mutatedNodesByType = mutatedNodes.get(klass);

    if (mutatedNodesByType === undefined) {
      return;
    }

    listener(mutatedNodesByType);
  });
}

function triggerListeners(
  type,
  editor,
  isCurrentlyEnqueuingUpdates, // $FlowFixMe: needs refining
  ...payload
) {
  const previouslyUpdating = editor._updating;
  editor._updating = isCurrentlyEnqueuingUpdates;

  try {
    const listeners = Array.from(editor._listeners[type]);

    for (let i = 0; i < listeners.length; i++) {
      listeners[i](...payload);
    }
  } finally {
    editor._updating = previouslyUpdating;
  }
}
function triggerCommandListeners(editor, type, payload) {
  if (editor._updating === false || activeEditor !== editor) {
    let returnVal = false;
    editor.update(() => {
      returnVal = triggerCommandListeners(editor, type, payload);
    });
    return returnVal;
  }

  const editors = getEditorsToPropagate(editor);

  for (let i = 4; i >= 0; i--) {
    for (let e = 0; e < editors.length; e++) {
      const currentEditor = editors[e];
      const commandListeners = currentEditor._commands;
      const listenerInPriorityOrder = commandListeners.get(type);

      if (listenerInPriorityOrder !== undefined) {
        const listeners = listenerInPriorityOrder[i];

        if (listeners !== undefined) {
          for (const listener of listeners) {
            // $FlowFixMe[missing-type-arg]
            if (listener(payload, editor) === true) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

function triggerEnqueuedUpdates(editor) {
  const queuedUpdates = editor._updates;

  if (queuedUpdates.length !== 0) {
    const [updateFn, options] = queuedUpdates.shift();
    beginUpdate(editor, updateFn, options);
  }
}

function triggerDeferredUpdateCallbacks(editor) {
  const deferred = editor._deferred;
  editor._deferred = [];

  if (deferred.length !== 0) {
    const previouslyUpdating = editor._updating;
    editor._updating = true;

    try {
      for (let i = 0; i < deferred.length; i++) {
        deferred[i]();
      }
    } finally {
      editor._updating = previouslyUpdating;
    }
  }
}

function processNestedUpdates(editor, initialSkipTransforms) {
  const queuedUpdates = editor._updates;
  let skipTransforms = initialSkipTransforms || false; // Updates might grow as we process them, we so we'll need
  // to handle each update as we go until the updates array is
  // empty.

  while (queuedUpdates.length !== 0) {
    const [nextUpdateFn, options] = queuedUpdates.shift();
    let onUpdate;
    let tag;

    if (options !== undefined) {
      onUpdate = options.onUpdate;
      tag = options.tag;

      if (options.skipTransforms) {
        skipTransforms = true;
      }

      if (onUpdate) {
        editor._deferred.push(onUpdate);
      }

      if (tag) {
        editor._updateTags.add(tag);
      }
    }

    nextUpdateFn();
  }

  return skipTransforms;
}

function beginUpdate(editor, updateFn, options) {
  const updateTags = editor._updateTags;
  let onUpdate;
  let tag;
  let skipTransforms = false;

  if (options !== undefined) {
    onUpdate = options.onUpdate;
    tag = options.tag;

    if (tag != null) {
      updateTags.add(tag);
    }

    skipTransforms = options.skipTransforms;
  }

  if (onUpdate) {
    editor._deferred.push(onUpdate);
  }

  const currentEditorState = editor._editorState;
  let pendingEditorState = editor._pendingEditorState;
  let editorStateWasCloned = false;

  if (pendingEditorState === null) {
    pendingEditorState = editor._pendingEditorState =
      cloneEditorState(currentEditorState);
    editorStateWasCloned = true;
  }

  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  const previouslyUpdating = editor._updating;
  activeEditorState = pendingEditorState;
  isReadOnlyMode = false;
  editor._updating = true;
  activeEditor = editor;

  try {
    if (editorStateWasCloned) {
      pendingEditorState._selection = internalCreateSelection(editor);
    }

    const startingCompositionKey = editor._compositionKey;
    updateFn();
    skipTransforms = processNestedUpdates(editor, skipTransforms);
    applySelectionTransforms(pendingEditorState, editor);

    if (editor._dirtyType !== NO_DIRTY_NODES) {
      if (skipTransforms) {
        $normalizeAllDirtyTextNodes(pendingEditorState, editor);
      } else {
        $applyAllTransforms(pendingEditorState, editor);
      }

      processNestedUpdates(editor);
      $garbageCollectDetachedNodes(
        currentEditorState,
        pendingEditorState,
        editor._dirtyLeaves,
        editor._dirtyElements
      );
    }

    const endingCompositionKey = editor._compositionKey;

    if (startingCompositionKey !== endingCompositionKey) {
      pendingEditorState._flushSync = true;
    }

    const pendingSelection = pendingEditorState._selection;

    if ($isRangeSelection(pendingSelection)) {
      const pendingNodeMap = pendingEditorState._nodeMap;
      const anchorKey = pendingSelection.anchor.key;
      const focusKey = pendingSelection.focus.key;

      if (
        pendingNodeMap.get(anchorKey) === undefined ||
        pendingNodeMap.get(focusKey) === undefined
      ) {
        {
          throw Error(
            `updateEditor: selection has been lost because the previously selected nodes have been removed and selection wasn't moved to another node. Ensure selection changes after removing/replacing a selected node.`
          );
        }
      }
    } else if ($isNodeSelection(pendingSelection)) {
      // TODO: we should also validate node selection?
      if (pendingSelection._nodes.size === 0) {
        pendingEditorState._selection = null;
      }
    }
  } catch (error) {
    // Report errors
    editor._onError(error); // Restore existing editor state to the DOM

    editor._pendingEditorState = currentEditorState;
    editor._dirtyType = FULL_RECONCILE;

    editor._cloneNotNeeded.clear();

    editor._dirtyLeaves = new Set();

    editor._dirtyElements.clear();

    commitPendingUpdates(editor);
    return;
  } finally {
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
    editor._updating = previouslyUpdating;
    infiniteTransformCount = 0;
  }

  const shouldUpdate =
    editor._dirtyType !== NO_DIRTY_NODES ||
    editorStateHasDirtySelection(pendingEditorState, editor);

  if (shouldUpdate) {
    if (pendingEditorState._flushSync) {
      pendingEditorState._flushSync = false;
      commitPendingUpdates(editor);
    } else if (editorStateWasCloned) {
      scheduleMicroTask(() => {
        commitPendingUpdates(editor);
      });
    }
  } else {
    pendingEditorState._flushSync = false;

    if (editorStateWasCloned) {
      updateTags.clear();
      editor._deferred = [];
      editor._pendingEditorState = null;
    }
  }
}

function updateEditor(editor, updateFn, options) {
  if (editor._updating) {
    editor._updates.push([updateFn, options]);
  } else {
    beginUpdate(editor, updateFn, options);
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const TEXT_MUTATION_VARIANCE = 100;
let isProcessingMutations = false;
let lastTextEntryTimeStamp = 0;
function getIsProcesssingMutations() {
  return isProcessingMutations;
}

function updateTimeStamp(event) {
  lastTextEntryTimeStamp = event.timeStamp;
}

function initTextEntryListener() {
  if (lastTextEntryTimeStamp === 0) {
    window.addEventListener("textInput", updateTimeStamp, true);
  }
}

function isManagedLineBreak(dom, target, editor) {
  return (
    // $FlowFixMe: internal field
    target.__lexicalLineBreak === dom || // $FlowFixMe: internal field
    dom["__lexicalKey_" + editor._key] !== undefined
  );
}

function getLastSelection(editor) {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    return selection !== null ? selection.clone() : null;
  });
}

function handleTextMutation(target, node, editor) {
  const domSelection = getDOMSelection();
  let anchorOffset = null;
  let focusOffset = null;

  if (domSelection !== null && domSelection.anchorNode === target) {
    anchorOffset = domSelection.anchorOffset;
    focusOffset = domSelection.focusOffset;
  }

  const text = target.nodeValue;
  $updateTextNodeFromDOMContent(node, text, anchorOffset, focusOffset, false);
}

function $flushMutations(editor, mutations, observer) {
  isProcessingMutations = true;
  const shouldFlushTextMutations =
    performance.now() - lastTextEntryTimeStamp > TEXT_MUTATION_VARIANCE;

  try {
    updateEditor(editor, () => {
      const badDOMTargets = new Map();
      const rootElement = editor.getRootElement(); // We use the current edtior state, as that reflects what is
      // actually "on screen".

      const currentEditorState = editor._editorState;
      let shouldRevertSelection = false;
      let possibleTextForFirefoxPaste = "";

      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        const type = mutation.type;
        const targetDOM = mutation.target;
        let targetNode = $getNearestNodeFromDOMNode(
          targetDOM,
          currentEditorState
        );

        if ($isDecoratorNode(targetNode)) {
          continue;
        }

        if (type === "characterData") {
          // Text mutations are deferred and passed to mutation listeners to be
          // processed outside of the Lexical engine.
          if (
            shouldFlushTextMutations &&
            targetDOM.nodeType === DOM_TEXT_TYPE &&
            $isTextNode(targetNode) &&
            targetNode.isAttached()
          ) {
            handleTextMutation(
              // $FlowFixMe: nodeType === DOM_TEXT_TYPE is a Text DOM node
              targetDOM,
              targetNode
            );
          }
        } else if (type === "childList") {
          shouldRevertSelection = true; // We attempt to "undo" any changes that have occurred outside
          // of Lexical. We want Lexical's editor state to be source of truth.
          // To the user, these will look like no-ops.

          const addedDOMs = mutation.addedNodes;

          for (let s = 0; s < addedDOMs.length; s++) {
            const addedDOM = addedDOMs[s];
            const node = getNodeFromDOMNode(addedDOM);
            const parentDOM = addedDOM.parentNode;

            if (
              parentDOM != null &&
              node === null &&
              (addedDOM.nodeName !== "BR" ||
                !isManagedLineBreak(addedDOM, parentDOM, editor))
            ) {
              if (IS_FIREFOX) {
                const possibleText = addedDOM.innerText || addedDOM.nodeValue;

                if (possibleText) {
                  possibleTextForFirefoxPaste += possibleText;
                }
              }

              parentDOM.removeChild(addedDOM);
            }
          }

          const removedDOMs = mutation.removedNodes;
          const removedDOMsLength = removedDOMs.length;

          if (removedDOMsLength > 0) {
            let unremovedBRs = 0;

            for (let s = 0; s < removedDOMsLength; s++) {
              const removedDOM = removedDOMs[s];

              if (
                removedDOM.nodeName === "BR" &&
                isManagedLineBreak(removedDOM, targetDOM, editor)
              ) {
                targetDOM.appendChild(removedDOM);
                unremovedBRs++;
              }
            }

            if (removedDOMsLength !== unremovedBRs) {
              if (targetDOM === rootElement) {
                targetNode = internalGetRoot(currentEditorState);
              }

              badDOMTargets.set(targetDOM, targetNode);
            }
          }
        }
      } // Now we process each of the unique target nodes, attempting
      // to restore their contents back to the source of truth, which
      // is Lexical's "current" editor state. This is basically like
      // an internal revert on the DOM.

      if (badDOMTargets.size > 0) {
        for (const [targetDOM, targetNode] of badDOMTargets) {
          if ($isElementNode(targetNode)) {
            const childKeys = targetNode.__children;
            let currentDOM = targetDOM.firstChild;

            for (let s = 0; s < childKeys.length; s++) {
              const key = childKeys[s];
              const correctDOM = editor.getElementByKey(key);

              if (correctDOM === null) {
                continue;
              }

              if (currentDOM == null) {
                targetDOM.appendChild(correctDOM);
                currentDOM = correctDOM;
              } else if (currentDOM !== correctDOM) {
                targetDOM.replaceChild(correctDOM, currentDOM);
              }

              currentDOM = currentDOM.nextSibling;
            }
          } else if ($isTextNode(targetNode)) {
            targetNode.markDirty();
          }
        }
      } // Capture all the mutations made during this function. This
      // also prevents us having to process them on the next cycle
      // of onMutation, as these mutations were made by us.

      const records = observer.takeRecords(); // Check for any random auto-added <br> elements, and remove them.
      // These get added by the browser when we undo the above mutations
      // and this can lead to a broken UI.

      if (records.length > 0) {
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const addedNodes = record.addedNodes;
          const target = record.target;

          for (let s = 0; s < addedNodes.length; s++) {
            const addedDOM = addedNodes[s];
            const parentDOM = addedDOM.parentNode;

            if (
              parentDOM != null &&
              addedDOM.nodeName === "BR" &&
              !isManagedLineBreak(addedDOM, target, editor)
            ) {
              parentDOM.removeChild(addedDOM);
            }
          }
        } // Clear any of those removal mutations

        observer.takeRecords();
      }

      const selection = $getSelection() || getLastSelection(editor);

      if (selection !== null) {
        if (shouldRevertSelection) {
          selection.dirty = true;
          $setSelection(selection);
        }

        if (IS_FIREFOX && isFirefoxClipboardEvents()) {
          selection.insertRawText(possibleTextForFirefoxPaste);
        }
      }
    });
  } finally {
    isProcessingMutations = false;
  }
}
function flushRootMutations(editor) {
  const observer = editor._observer;

  if (observer !== null) {
    const mutations = observer.takeRecords();
    $flushMutations(editor, mutations, observer);
  }
}
function initMutationObserver(editor) {
  initTextEntryListener();
  editor._observer = new MutationObserver((mutations, observer) => {
    $flushMutations(editor, mutations, observer);
  });
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

class Point {
  constructor(key, offset, type) {
    this.key = key;
    this.offset = offset;
    this.type = type;
  }

  is(point) {
    return (
      this.key === point.key &&
      this.offset === point.offset &&
      this.type === point.type
    );
  }

  isBefore(b) {
    let aNode = this.getNode();
    let bNode = b.getNode();
    const aOffset = this.offset;
    const bOffset = b.offset;

    if ($isElementNode(aNode)) {
      aNode = aNode.getDescendantByIndex(aOffset);
    }

    if ($isElementNode(bNode)) {
      bNode = bNode.getDescendantByIndex(bOffset);
    }

    if (aNode === bNode) {
      return aOffset < bOffset;
    }

    return aNode.isBefore(bNode);
  }

  getNode() {
    const key = this.key;
    const node = $getNodeByKey(key);

    if (node === null) {
      {
        throw Error(`Point.getNode: node not found`);
      }
    }

    return node;
  }

  set(key, offset, type) {
    const selection = $getSelection();
    const oldKey = this.key;
    this.key = key;
    this.offset = offset;
    this.type = type;

    if (!isCurrentlyReadOnlyMode()) {
      if ($getCompositionKey() === oldKey) {
        $setCompositionKey(key);
      }

      if (
        selection !== null &&
        (selection.anchor === this || selection.focus === this)
      ) {
        selection.dirty = true;
      }
    }
  }
}

function $createPoint(key, offset, type) {
  // $FlowFixMe: intentionally cast as we use a class for perf reasons
  return new Point(key, offset, type);
}

function selectPointOnNode(point, node) {
  const key = node.__key;
  let offset = point.offset;
  let type = "element";

  if ($isTextNode(node)) {
    type = "text";
    const textContentLength = node.getTextContentSize();

    if (offset > textContentLength) {
      offset = textContentLength;
    }
  }

  point.set(key, offset, type);
}

function $moveSelectionPointToEnd(point, node) {
  if ($isElementNode(node)) {
    const lastNode = node.getLastDescendant();

    if ($isElementNode(lastNode) || $isTextNode(lastNode)) {
      selectPointOnNode(point, lastNode);
    } else {
      selectPointOnNode(point, node);
    }
  } else if ($isTextNode(node)) {
    selectPointOnNode(point, node);
  }
}

function $transferStartingElementPointToTextPoint(start, end, format) {
  const element = start.getNode();
  const placementNode = element.getChildAtIndex(start.offset);
  const textNode = $createTextNode();
  const target = $isRootNode(element)
    ? $createParagraphNode().append(textNode)
    : textNode;
  textNode.setFormat(format);

  if (placementNode === null) {
    element.append(target);
  } else {
    placementNode.insertBefore(target);
  } // Transfer the element point to a text point.

  if (start.is(end)) {
    end.set(textNode.__key, 0, "text");
  }

  start.set(textNode.__key, 0, "text");
}

function $setPointValues(point, key, offset, type) {
  point.key = key; // $FlowFixMe: internal utility function

  point.offset = offset; // $FlowFixMe: internal utility function

  point.type = type;
}

class NodeSelection {
  constructor(objects) {
    this.dirty = false;
    this._nodes = objects;
  }

  is(selection) {
    if (!$isNodeSelection(selection)) {
      return false;
    }

    const a = this._nodes;
    const b = selection._nodes;
    return a.size === b.size && Array.from(a).every((key) => b.has(key));
  }

  add(key) {
    this.dirty = true;

    this._nodes.add(key);
  }

  delete(key) {
    this.dirty = true;

    this._nodes.delete(key);
  }

  clear() {
    this.dirty = true;

    this._nodes.clear();
  }

  has(key) {
    return this._nodes.has(key);
  }

  clone() {
    return new NodeSelection(new Set(this._nodes));
  }

  extract() {
    return this.getNodes();
  }

  insertRawText(text) {
    // Do nothing?
  }

  insertText() {
    // Do nothing?
  }

  getNodes() {
    const objects = this._nodes;
    const nodes = [];

    for (const object of objects) {
      const node = $getNodeByKey(object);

      if (node !== null) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  getTextContent() {
    const nodes = this.getNodes();
    let textContent = "";

    for (let i = 0; i < nodes.length; i++) {
      textContent += nodes[i].getTextContent();
    }

    return textContent;
  }
}
function $isRangeSelection(x) {
  return x instanceof RangeSelection;
}
class GridSelection {
  constructor(gridKey, anchor, focus) {
    this.gridKey = gridKey;
    this.anchor = anchor;
    this.focus = focus;
    this.dirty = false;
  }

  is(selection) {
    if (!$isGridSelection(selection)) {
      return false;
    }

    return this.gridKey === selection.gridKey && this.anchor.is(this.focus);
  }

  set(gridKey, anchorCellKey, focusCellKey) {
    this.dirty = true;
    this.gridKey = gridKey;
    this.anchor.key = anchorCellKey;
    this.focus.key = focusCellKey;
  }

  clone() {
    return new GridSelection(this.gridKey, this.anchor, this.focus);
  }

  isCollapsed() {
    return false;
  }

  isBackward() {
    return this.focus.isBefore(this.anchor);
  }

  getCharacterOffsets() {
    return getCharacterOffsets(this);
  }

  extract() {
    return this.getNodes();
  }

  insertRawText(text) {
    // Do nothing?
  }

  insertText() {
    // Do nothing?
  }

  getShape() {
    const anchorCellNode = $getNodeByKey(this.anchor.key);

    if (!anchorCellNode) {
      throw Error(`getNodes: expected to find AnchorNode`);
    }

    const anchorCellNodeIndex = anchorCellNode.getIndexWithinParent();
    const anchorCelRoweIndex = anchorCellNode
      .getParentOrThrow()
      .getIndexWithinParent();
    const focusCellNode = $getNodeByKey(this.focus.key);

    if (!focusCellNode) {
      throw Error(`getNodes: expected to find FocusNode`);
    }

    const focusCellNodeIndex = focusCellNode.getIndexWithinParent();
    const focusCellRowIndex = focusCellNode
      .getParentOrThrow()
      .getIndexWithinParent();
    const startX = Math.min(anchorCellNodeIndex, focusCellNodeIndex);
    const stopX = Math.max(anchorCellNodeIndex, focusCellNodeIndex);
    const startY = Math.min(anchorCelRoweIndex, focusCellRowIndex);
    const stopY = Math.max(anchorCelRoweIndex, focusCellRowIndex);
    return {
      fromX: Math.min(startX, stopX),
      fromY: Math.min(startY, stopY),
      toX: Math.max(startX, stopX),
      toY: Math.max(startY, stopY),
    };
  }

  getNodes() {
    const nodes = new Set();
    const { fromX, fromY, toX, toY } = this.getShape();
    const gridNode = $getNodeByKey(this.gridKey);

    if (!$isGridNode(gridNode)) {
      {
        throw Error(`getNodes: expected to find GridNode`);
      }
    }

    nodes.add(gridNode);
    const gridRowNodes = gridNode.getChildren();

    for (let r = fromY; r <= toY; r++) {
      const gridRowNode = gridRowNodes[r];
      nodes.add(gridRowNode);

      if (!$isGridRowNode(gridRowNode)) {
        {
          throw Error(`getNodes: expected to find GridRowNode`);
        }
      }

      const gridCellNodes = gridRowNode.getChildren();

      for (let c = fromX; c <= toX; c++) {
        const gridCellNode = gridCellNodes[c];

        if (!$isGridCellNode(gridCellNode)) {
          {
            throw Error(`getNodes: expected to find GridCellNode`);
          }
        }

        nodes.add(gridCellNode);
        const children = gridCellNode.getChildren();

        while (children.length > 0) {
          const child = children.shift();
          nodes.add(child);

          if ($isElementNode(child)) {
            children.unshift(...child.getChildren());
          }
        }
      }
    }

    return Array.from(nodes);
  }

  getTextContent() {
    const nodes = this.getNodes();
    let textContent = "";

    for (let i = 0; i < nodes.length; i++) {
      textContent += nodes[i].getTextContent();
    }

    return textContent;
  }
}
function $isGridSelection(x) {
  return x instanceof GridSelection;
}
class RangeSelection {
  constructor(anchor, focus, format) {
    this.anchor = anchor;
    this.focus = focus;
    this.dirty = false;
    this.format = format;
  }

  is(selection) {
    if (!$isRangeSelection(selection)) {
      return false;
    }

    return (
      this.anchor.is(selection.anchor) &&
      this.focus.is(selection.focus) &&
      this.format === selection.format
    );
  }

  isBackward() {
    return this.focus.isBefore(this.anchor);
  }

  isCollapsed() {
    return this.anchor.is(this.focus);
  }

  getNodes() {
    const anchor = this.anchor;
    const focus = this.focus;
    let firstNode = anchor.getNode();
    let lastNode = focus.getNode();

    if ($isElementNode(firstNode)) {
      firstNode = firstNode.getDescendantByIndex(anchor.offset);
    }

    if ($isElementNode(lastNode)) {
      lastNode = lastNode.getDescendantByIndex(focus.offset);
    }

    if (firstNode.is(lastNode)) {
      if (
        $isElementNode(firstNode) &&
        (firstNode.getChildrenSize() > 0 || firstNode.excludeFromCopy())
      ) {
        return [];
      }

      return [firstNode];
    }

    return firstNode.getNodesBetween(lastNode);
  }

  setTextNodeRange(anchorNode, anchorOffset, focusNode, focusOffset) {
    $setPointValues(this.anchor, anchorNode.__key, anchorOffset, "text");
    $setPointValues(this.focus, focusNode.__key, focusOffset, "text");
    this.dirty = true;
  }

  getTextContent() {
    const nodes = this.getNodes();

    if (nodes.length === 0) {
      return "";
    }

    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    const anchor = this.anchor;
    const focus = this.focus;
    const isBefore = anchor.isBefore(focus);
    const [anchorOffset, focusOffset] = getCharacterOffsets(this);
    let textContent = "";
    let prevWasElement = true;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if ($isElementNode(node) && !node.isInline()) {
        if (!prevWasElement) {
          textContent += "\n";
        }

        if (node.isEmpty()) {
          prevWasElement = false;
        } else {
          prevWasElement = true;
        }
      } else {
        prevWasElement = false;

        if ($isTextNode(node)) {
          let text = node.getTextContent();

          if (node === firstNode) {
            if (node === lastNode) {
              text =
                anchorOffset < focusOffset
                  ? text.slice(anchorOffset, focusOffset)
                  : text.slice(focusOffset, anchorOffset);
            } else {
              text = isBefore
                ? text.slice(anchorOffset)
                : text.slice(focusOffset);
            }
          } else if (node === lastNode) {
            text = isBefore
              ? text.slice(0, focusOffset)
              : text.slice(0, anchorOffset);
          }

          textContent += text;
        } else if (
          ($isDecoratorNode(node) || $isLineBreakNode(node)) &&
          (node !== lastNode || !this.isCollapsed())
        ) {
          textContent += node.getTextContent();
        }
      }
    }

    return textContent;
  }

  applyDOMRange(range) {
    const editor = getActiveEditor();
    const currentEditorState = editor.getEditorState();
    const lastSelection = currentEditorState._selection;
    const resolvedSelectionPoints = internalResolveSelectionPoints(
      range.startContainer,
      range.startOffset,
      range.endContainer,
      range.endOffset,
      editor,
      lastSelection
    );

    if (resolvedSelectionPoints === null) {
      return;
    }

    const [anchorPoint, focusPoint] = resolvedSelectionPoints;
    $setPointValues(
      this.anchor,
      anchorPoint.key,
      anchorPoint.offset,
      anchorPoint.type
    );
    $setPointValues(
      this.focus,
      focusPoint.key,
      focusPoint.offset,
      focusPoint.type
    );
  }

  clone() {
    const anchor = this.anchor;
    const focus = this.focus;
    return new RangeSelection(
      $createPoint(anchor.key, anchor.offset, anchor.type),
      $createPoint(focus.key, focus.offset, focus.type),
      this.format
    );
  }

  toggleFormat(format) {
    this.format = toggleTextFormatType(this.format, format, null);
    this.dirty = true;
  }

  hasFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT[type];
    return (this.format & formatFlag) !== 0;
  }

  insertRawText(text) {
    const parts = text.split(/\r?\n/);

    if (parts.length === 1) {
      this.insertText(text);
    } else {
      const nodes = [];
      const length = parts.length;

      for (let i = 0; i < length; i++) {
        const part = parts[i];

        if (part !== "") {
          nodes.push($createTextNode(part));
        }

        if (i !== length - 1) {
          nodes.push($createLineBreakNode());
        }
      }

      this.insertNodes(nodes);
    }
  }

  insertText(text) {
    const anchor = this.anchor;
    const focus = this.focus;
    const isBefore = this.isCollapsed() || anchor.isBefore(focus);
    const format = this.format;

    if (isBefore && anchor.type === "element") {
      $transferStartingElementPointToTextPoint(anchor, focus, format);
    } else if (!isBefore && focus.type === "element") {
      $transferStartingElementPointToTextPoint(focus, anchor, format);
    }

    const selectedNodes = this.getNodes();
    const selectedNodesLength = selectedNodes.length;
    const firstPoint = isBefore ? anchor : focus;
    const endPoint = isBefore ? focus : anchor;
    const startOffset = firstPoint.offset;
    const endOffset = endPoint.offset;
    let firstNode = selectedNodes[0];

    if (!$isTextNode(firstNode)) {
      {
        throw Error(`insertText: first node is not a text node`);
      }
    }

    const firstNodeText = firstNode.getTextContent();
    const firstNodeTextLength = firstNodeText.length;
    const firstNodeParent = firstNode.getParentOrThrow();
    const lastIndex = selectedNodesLength - 1;
    let lastNode = selectedNodes[lastIndex];

    if (
      this.isCollapsed() &&
      startOffset === firstNodeTextLength &&
      (firstNode.isSegmented() ||
        firstNode.isToken() ||
        !firstNode.canInsertTextAfter() ||
        !firstNodeParent.canInsertTextAfter())
    ) {
      let nextSibling = firstNode.getNextSibling();

      if (
        !$isTextNode(nextSibling) ||
        $isTokenOrInertOrSegmented(nextSibling)
      ) {
        nextSibling = $createTextNode();

        if (!firstNodeParent.canInsertTextAfter()) {
          firstNodeParent.insertAfter(nextSibling);
        } else {
          firstNode.insertAfter(nextSibling);
        }
      }

      nextSibling.select(0, 0);
      firstNode = nextSibling;

      if (text !== "") {
        this.insertText(text);
        return;
      }
    } else if (
      this.isCollapsed() &&
      startOffset === 0 &&
      (firstNode.isSegmented() ||
        firstNode.isToken() ||
        !firstNode.canInsertTextBefore() ||
        !firstNodeParent.canInsertTextBefore())
    ) {
      let prevSibling = firstNode.getPreviousSibling();

      if (
        !$isTextNode(prevSibling) ||
        $isTokenOrInertOrSegmented(prevSibling)
      ) {
        prevSibling = $createTextNode();

        if (!firstNodeParent.canInsertTextBefore()) {
          firstNodeParent.insertBefore(prevSibling);
        } else {
          firstNode.insertBefore(prevSibling);
        }
      }

      prevSibling.select();
      firstNode = prevSibling;

      if (text !== "") {
        this.insertText(text);
        return;
      }
    } else if (firstNode.isSegmented() && startOffset !== firstNodeTextLength) {
      const textNode = $createTextNode(firstNode.getTextContent());
      firstNode.replace(textNode);
      firstNode = textNode;
    } else if (!this.isCollapsed() && text !== "") {
      // When the firstNode or lastNode parents are elements that
      // do not allow text to be inserted before or after, we first
      // clear the content. Then we normalize selection, then insert
      // the new content.
      const lastNodeParent = lastNode.getParent();

      if (
        !firstNodeParent.canInsertTextBefore() ||
        !firstNodeParent.canInsertTextAfter() ||
        ($isElementNode(lastNodeParent) &&
          (!lastNodeParent.canInsertTextBefore() ||
            !lastNodeParent.canInsertTextAfter()))
      ) {
        this.insertText("");
        normalizeSelectionPointsForBoundaries(this.anchor, this.focus, null);
        this.insertText(text);
        return;
      }
    }

    if (selectedNodesLength === 1) {
      if ($isTokenOrInert(firstNode)) {
        const textNode = $createTextNode(text);
        textNode.select();
        firstNode.replace(textNode);
        return;
      }

      const firstNodeFormat = firstNode.getFormat();

      if (startOffset === endOffset && firstNodeFormat !== format) {
        if (firstNode.getTextContent() === "") {
          firstNode.setFormat(format);
        } else {
          const textNode = $createTextNode(text);
          textNode.setFormat(format);
          textNode.select();

          if (startOffset === 0) {
            firstNode.insertBefore(textNode);
          } else {
            const [targetNode] = firstNode.splitText(startOffset);
            targetNode.insertAfter(textNode);
          } // When composing, we need to adjust the anchor offset so that
          // we correctly replace that right range.

          if (textNode.isComposing() && this.anchor.type === "text") {
            this.anchor.offset -= text.length;
          }

          return;
        }
      }

      const delCount = endOffset - startOffset;
      firstNode = firstNode.spliceText(startOffset, delCount, text, true);

      if (firstNode.getTextContent() === "") {
        firstNode.remove();
      } else if (firstNode.isComposing() && this.anchor.type === "text") {
        // When composing, we need to adjust the anchor offset so that
        // we correctly replace that right range.
        this.anchor.offset -= text.length;
      }
    } else {
      const markedNodeKeysForKeep = new Set([
        ...firstNode.getParentKeys(),
        ...lastNode.getParentKeys(),
      ]);
      const firstElement = $isElementNode(firstNode)
        ? firstNode
        : firstNode.getParentOrThrow();
      const lastElement = $isElementNode(lastNode)
        ? lastNode
        : lastNode.getParentOrThrow(); // Handle mutations to the last node.

      if (
        (endPoint.type === "text" &&
          (endOffset !== 0 || lastNode.getTextContent() === "")) ||
        (endPoint.type === "element" &&
          lastNode.getIndexWithinParent() < endOffset)
      ) {
        if (
          $isTextNode(lastNode) &&
          !$isTokenOrInert(lastNode) &&
          endOffset !== lastNode.getTextContentSize()
        ) {
          if (lastNode.isSegmented()) {
            const textNode = $createTextNode(lastNode.getTextContent());
            lastNode.replace(textNode);
            lastNode = textNode;
          }

          lastNode = lastNode.spliceText(0, endOffset, "");
          markedNodeKeysForKeep.add(lastNode.__key);
        } else {
          const lastNodeParent = lastNode.getParentOrThrow();

          if (
            !lastNodeParent.canBeEmpty() &&
            lastNodeParent.getChildrenSize() === 1
          ) {
            lastNodeParent.remove();
          } else {
            lastNode.remove();
          }
        }
      } else {
        markedNodeKeysForKeep.add(lastNode.__key);
      } // Either move the remaining nodes of the last parent to after
      // the first child, or remove them entirely. If the last parent
      // is the same as the first parent, this logic also works.

      const lastNodeChildren = lastElement.getChildren();
      const selectedNodesSet = new Set(selectedNodes);
      const firstAndLastElementsAreEqual = firstElement.is(lastElement); // If the last element is an "inline" element, don't move it's text nodes to the first node.
      // Instead, preserve the "inline" element's children and append to the first element.

      if (!lastElement.canBeEmpty() && firstElement !== lastElement) {
        firstElement.append(lastElement);
      } else {
        for (let i = lastNodeChildren.length - 1; i >= 0; i--) {
          const lastNodeChild = lastNodeChildren[i];

          if (
            lastNodeChild.is(firstNode) ||
            ($isElementNode(lastNodeChild) &&
              lastNodeChild.isParentOf(firstNode))
          ) {
            break;
          }

          if (lastNodeChild.isAttached()) {
            if (
              !selectedNodesSet.has(lastNodeChild) ||
              lastNodeChild.is(lastNode)
            ) {
              if (!firstAndLastElementsAreEqual) {
                firstNode.insertAfter(lastNodeChild);
              }
            } else {
              lastNodeChild.remove();
            }
          }
        }

        if (!firstAndLastElementsAreEqual) {
          // Check if we have already moved out all the nodes of the
          // last parent, and if so, traverse the parent tree and mark
          // them all as being able to deleted too.
          let parent = lastElement;
          let lastRemovedParent = null;

          while (parent !== null) {
            const children = parent.getChildren();
            const childrenLength = children.length;

            if (
              childrenLength === 0 ||
              children[childrenLength - 1].is(lastRemovedParent)
            ) {
              markedNodeKeysForKeep.delete(parent.__key);
              lastRemovedParent = parent;
            }

            parent = parent.getParent();
          }
        }
      } // Ensure we do splicing after moving of nodes, as splicing
      // can have side-effects (in the case of hashtags).

      if (!$isTokenOrInert(firstNode)) {
        firstNode = firstNode.spliceText(
          startOffset,
          firstNodeTextLength - startOffset,
          text,
          true
        );

        if (firstNode.getTextContent() === "") {
          firstNode.remove();
        } else if (firstNode.isComposing() && this.anchor.type === "text") {
          // When composing, we need to adjust the anchor offset so that
          // we correctly replace that right range.
          this.anchor.offset -= text.length;
        }
      } else if (startOffset === firstNodeTextLength) {
        firstNode.select();
      } else {
        const textNode = $createTextNode(text);
        textNode.select();
        firstNode.replace(textNode);
      } // Remove all selected nodes that haven't already been removed.

      for (let i = 1; i < selectedNodesLength; i++) {
        const selectedNode = selectedNodes[i];
        const key = selectedNode.__key;

        if (!markedNodeKeysForKeep.has(key)) {
          selectedNode.remove();
        }
      }
    }
  }

  removeText() {
    this.insertText("");
  }

  formatText(formatType) {
    // TODO I wonder if this methods use selection.extract() instead?
    const selectedNodes = this.getNodes();
    const selectedNodesLength = selectedNodes.length;
    const lastIndex = selectedNodesLength - 1;
    let firstNode = selectedNodes[0];
    let lastNode = selectedNodes[lastIndex];

    if (this.isCollapsed()) {
      this.toggleFormat(formatType); // When changing format, we should stop composition

      $setCompositionKey(null);
      return;
    }

    const anchor = this.anchor;
    const focus = this.focus;
    const focusOffset = focus.offset;
    let firstNextFormat = 0;
    let firstNodeTextLength = firstNode.getTextContent().length;

    for (let i = 0; i < selectedNodes.length; i++) {
      const selectedNode = selectedNodes[i];

      if ($isTextNode(selectedNode)) {
        firstNextFormat = selectedNode.getFormatFlags(formatType, null);
        break;
      }
    }

    let anchorOffset = anchor.offset;
    let startOffset;
    let endOffset;
    const isBefore = anchor.isBefore(focus);
    startOffset = isBefore ? anchorOffset : focusOffset;
    endOffset = isBefore ? focusOffset : anchorOffset; // This is the case where the user only selected the very end of the
    // first node so we don't want to include it in the formatting change.

    if (startOffset === firstNode.getTextContentSize()) {
      const nextSibling = firstNode.getNextSibling();

      if ($isTextNode(nextSibling)) {
        // we basically make the second node the firstNode, changing offsets accordingly
        anchorOffset = 0;
        startOffset = 0;
        firstNode = nextSibling;
        firstNodeTextLength = nextSibling.getTextContent().length;
        firstNextFormat = firstNode.getFormatFlags(formatType, null);
      }
    } // This is the case where we only selected a single node

    if (firstNode.is(lastNode)) {
      if ($isTextNode(firstNode)) {
        if (anchor.type === "element" && focus.type === "element") {
          firstNode.setFormat(firstNextFormat);
          firstNode.select(startOffset, endOffset);
          this.format = firstNextFormat;
          return;
        }

        startOffset = anchorOffset > focusOffset ? focusOffset : anchorOffset;
        endOffset = anchorOffset > focusOffset ? anchorOffset : focusOffset; // No actual text is selected, so do nothing.

        if (startOffset === endOffset) {
          return;
        } // The entire node is selected, so just format it

        if (startOffset === 0 && endOffset === firstNodeTextLength) {
          firstNode.setFormat(firstNextFormat);
          firstNode.select(startOffset, endOffset);
        } else {
          // ndoe is partially selected, so split it into two nodes
          // adnd style the selected one.
          const splitNodes = firstNode.splitText(startOffset, endOffset);
          const replacement = startOffset === 0 ? splitNodes[0] : splitNodes[1];
          replacement.setFormat(firstNextFormat);
          replacement.select(0, endOffset - startOffset);
        }

        this.format = firstNextFormat;
      } // multiple nodes selected.
    } else {
      if ($isTextNode(firstNode)) {
        if (startOffset !== 0) {
          // the entire first node isn't selected, so split it
          [, firstNode] = firstNode.splitText(startOffset);
          startOffset = 0;
        }

        firstNode.setFormat(firstNextFormat);
      }

      let lastNextFormat = firstNextFormat;

      if ($isTextNode(lastNode)) {
        lastNextFormat = lastNode.getFormatFlags(formatType, firstNextFormat);
        const lastNodeText = lastNode.getTextContent();
        const lastNodeTextLength = lastNodeText.length; // if the offset is 0, it means no actual characters are selected,
        // so we skip formatting the last node altogether.

        if (endOffset !== 0) {
          // if the entire last node isn't selected, split it
          if (endOffset !== lastNodeTextLength) {
            [lastNode] = lastNode.splitText(endOffset);
          }

          lastNode.setFormat(lastNextFormat);
        }
      } // deal with all the nodes in between

      for (let i = 1; i < lastIndex; i++) {
        const selectedNode = selectedNodes[i];
        const selectedNodeKey = selectedNode.__key;

        if (
          $isTextNode(selectedNode) &&
          selectedNodeKey !== firstNode.__key &&
          selectedNodeKey !== lastNode.__key &&
          !selectedNode.isToken()
        ) {
          const selectedNextFormat = selectedNode.getFormatFlags(
            formatType,
            lastNextFormat
          );
          selectedNode.setFormat(selectedNextFormat);
        }
      }
    }
  }

  insertNodes(nodes, selectStart) {
    // If there is a range selected remove the text in it
    if (!this.isCollapsed()) {
      this.removeText();
    }

    const anchor = this.anchor;
    const anchorOffset = anchor.offset;
    const anchorNode = anchor.getNode();
    let target = anchorNode;

    if (anchor.type === "element") {
      const element = anchor.getNode();
      const placementNode = element.getChildAtIndex(anchorOffset - 1);

      if (placementNode === null) {
        target = element;
      } else {
        target = placementNode;
      }
    }

    const siblings = []; // Get all remaining text node siblings in this element so we can
    // append them after the last node we're inserting.

    const nextSiblings = anchorNode.getNextSiblings();
    const topLevelElement = $isRootNode(anchorNode)
      ? null
      : anchorNode.getTopLevelElementOrThrow();

    if ($isTextNode(anchorNode)) {
      const textContent = anchorNode.getTextContent();
      const textContentLength = textContent.length;

      if (anchorOffset === 0 && textContentLength !== 0) {
        const prevSibling = anchorNode.getPreviousSibling();

        if (prevSibling !== null) {
          target = prevSibling;
        } else {
          target = anchorNode.getParentOrThrow();
        }

        siblings.push(anchorNode);
      } else if (anchorOffset === textContentLength) {
        target = anchorNode;
      } else if ($isTokenOrInert(anchorNode)) {
        // Do nothing if we're inside an immutable/inert node
        return false;
      } else {
        // If we started with a range selected grab the danglingText after the
        // end of the selection and put it on our siblings array so we can
        // append it after the last node we're inserting
        let danglingText;
        [target, danglingText] = anchorNode.splitText(anchorOffset);
        siblings.push(danglingText);
      }
    }

    const startingNode = target;
    siblings.push(...nextSiblings);
    const firstNode = nodes[0];
    let didReplaceOrMerge = false;
    let lastNodeInserted = null; // Time to insert the nodes!

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if ($isElementNode(node)) {
        // -----
        // Heuristics for the replacment or merging of elements
        // -----
        // If we have an incoming element node as the first node, then we'll need
        // see if we can merge any descendant leaf nodes into our existing target.
        // We can do this by finding the first descendant in our node and then we can
        // pluck it and its parent (siblings included) out and insert them directly
        // into our target. We only do this for the first node, as we are only
        // interested in merging with the anchor, which is our target.
        //
        // If we apply either the replacement or merging heuristics, we need to be
        // careful that we're not trying to insert a non-element node into a root node,
        // so we check if the target's parent after this logic is the root node and if
        // so we trigger an invariant to ensure this problem is caught in development
        // and fixed accordingly.
        if (node.is(firstNode)) {
          if (
            $isElementNode(target) &&
            target.isEmpty() &&
            target.canReplaceWith(node)
          ) {
            target.replace(node);
            target = node;
            didReplaceOrMerge = true;
            continue;
          } // We may have a node tree where there are many levels, for example with
          // lists and tables. So let's find the first descendant to try and merge
          // with. So if we have the target:
          //
          // Paragraph (1)
          //   Text (2)
          //
          // and we are trying to insert:
          //
          // ListNode (3)
          //   ListItemNode (4)
          //     Text (5)
          //   ListItemNode (6)
          //
          // The result would be:
          //
          // Paragraph (1)
          //   Text (2)
          //   Text (5)
          //

          const firstDescendant = node.getFirstDescendant();

          if ($isLeafNode(firstDescendant)) {
            let element = firstDescendant.getParentOrThrow();

            while (element.isInline()) {
              element = element.getParentOrThrow();
            }

            const children = element.getChildren();
            const childrenLength = children.length;

            if ($isElementNode(target)) {
              for (let s = 0; s < childrenLength; s++) {
                lastNodeInserted = children[s];
                target.append(lastNodeInserted);
              }
            } else {
              for (let s = childrenLength - 1; s >= 0; s--) {
                lastNodeInserted = children[s];
                target.insertAfter(lastNodeInserted);
              }

              target = target.getParentOrThrow();
            }

            element.remove();
            didReplaceOrMerge = true;

            if (element.is(node)) {
              continue;
            }
          }
        }

        if ($isTextNode(target)) {
          if (topLevelElement === null) {
            {
              throw Error(`insertNode: topLevelElement is root node`);
            }
          }

          target = topLevelElement;
        }
      } else if (
        didReplaceOrMerge &&
        !$isDecoratorNode(node) &&
        $isRootNode(target.getParent())
      ) {
        {
          throw Error(
            `insertNodes: cannot insert a non-element into a root node`
          );
        }
      }

      didReplaceOrMerge = false;

      if ($isElementNode(target)) {
        lastNodeInserted = node;

        if ($isDecoratorNode(node) && node.isTopLevel()) {
          target = target.insertAfter(node);
        } else if (!$isElementNode(node)) {
          const firstChild = target.getFirstChild();

          if (firstChild !== null) {
            firstChild.insertBefore(node);
          } else {
            target.append(node);
          }

          target = node;
        } else {
          if (!node.canBeEmpty() && node.isEmpty()) {
            continue;
          }

          if ($isRootNode(target)) {
            const placementNode = target.getChildAtIndex(anchorOffset);

            if (placementNode !== null) {
              placementNode.insertBefore(node);
            } else {
              target.append(node);
            }

            target = node;
          } else {
            target = target.insertAfter(node);
          }
        }
      } else if (
        !$isElementNode(node) ||
        ($isDecoratorNode(target) && target.isTopLevel())
      ) {
        lastNodeInserted = node;
        target = target.insertAfter(node);
      } else {
        target = node.getParentOrThrow(); // Re-try again with the target being the parent

        i--;
        continue;
      }
    }

    if (selectStart) {
      // Handle moving selection to start for all nodes
      if ($isTextNode(startingNode)) {
        startingNode.select();
      } else {
        const prevSibling = target.getPreviousSibling();

        if ($isTextNode(prevSibling)) {
          prevSibling.select();
        } else {
          const index = target.getIndexWithinParent();
          target.getParentOrThrow().select(index, index);
        }
      }
    }

    if ($isElementNode(target)) {
      // If the last node to be inserted was a text node,
      // then we should attempt to move selection to that.
      const lastChild = $isTextNode(lastNodeInserted)
        ? lastNodeInserted
        : target.getLastDescendant();

      if (!selectStart) {
        // Handle moving selection to end for elements
        if (lastChild === null) {
          target.select();
        } else if ($isTextNode(lastChild)) {
          lastChild.select();
        } else {
          lastChild.selectNext();
        }
      }

      if (siblings.length !== 0) {
        for (let i = siblings.length - 1; i >= 0; i--) {
          const sibling = siblings[i];
          const prevParent = sibling.getParentOrThrow();

          if ($isElementNode(target) && !$isElementNode(sibling)) {
            target.append(sibling);
            target = sibling;
          } else if (!$isElementNode(target) && !$isElementNode(sibling)) {
            target.insertBefore(sibling);
            target = sibling;
          } else {
            if ($isElementNode(sibling) && !sibling.canInsertAfter(target)) {
              const prevParentClone = prevParent.constructor.clone(prevParent);

              if (!$isElementNode(prevParentClone)) {
                {
                  throw Error(
                    `insertNodes: cloned parent clone is not an element`
                  );
                }
              }

              prevParentClone.append(sibling);
              target.insertAfter(prevParentClone);
            } else {
              target.insertAfter(sibling);
            }
          } // Check if the prev parent is empty, as it might need
          // removing.

          if (prevParent.isEmpty() && !prevParent.canBeEmpty()) {
            prevParent.remove();
          }
        }
      }
    } else if (!selectStart) {
      // Handle moving selection to end for other nodes
      if ($isTextNode(target)) {
        target.select();
      } else {
        const element = target.getParentOrThrow();
        const index = target.getIndexWithinParent() + 1;
        element.select(index, index);
      }
    }

    return true;
  }

  insertParagraph() {
    if (!this.isCollapsed()) {
      this.removeText();
    }

    const anchor = this.anchor;
    const anchorOffset = anchor.offset;
    let currentElement;
    let nodesToMove = [];
    let siblingsToMove = [];

    if (anchor.type === "text") {
      const anchorNode = anchor.getNode();
      nodesToMove = anchorNode.getNextSiblings().reverse();
      currentElement = anchorNode.getParentOrThrow();
      const isInline = currentElement.isInline();
      const textContentLength = isInline
        ? currentElement.getTextContentSize()
        : anchorNode.getTextContentSize();

      if (anchorOffset === 0) {
        nodesToMove.push(anchorNode);
      } else {
        if (isInline) {
          // For inline nodes, we want to move all the siblings to the new paragraph
          // if selection is at the end, we just move the siblings. Otherwise, we also
          // split the text node and add that and it's siblings below.
          siblingsToMove = currentElement.getNextSiblings();
        }

        if (anchorOffset !== textContentLength) {
          if (!isInline || anchorOffset !== anchorNode.getTextContentSize()) {
            const [, splitNode] = anchorNode.splitText(anchorOffset);
            nodesToMove.push(splitNode);
          }
        }
      }
    } else {
      currentElement = anchor.getNode();

      if ($isRootNode(currentElement)) {
        const paragraph = $createParagraphNode();
        const child = currentElement.getChildAtIndex(anchorOffset);
        paragraph.select();

        if (child !== null) {
          child.insertBefore(paragraph);
        } else {
          currentElement.append(paragraph);
        }

        return;
      }

      nodesToMove = currentElement.getChildren().slice(anchorOffset).reverse();
    }

    const nodesToMoveLength = nodesToMove.length;

    if (
      anchorOffset === 0 &&
      nodesToMoveLength > 0 &&
      currentElement.isInline()
    ) {
      currentElement.getParentOrThrow().insertBefore($createParagraphNode());
      return;
    }

    const newElement = currentElement.insertNewAfter(this);

    if (newElement === null) {
      // Handle as a line break insertion
      this.insertLineBreak();
    } else if ($isElementNode(newElement)) {
      // If we're at the beginning of the current element, move the new element to be before the current element
      const currentElementFirstChild = currentElement.getFirstChild();
      const isBeginning =
        anchorOffset === 0 &&
        (currentElement.is(anchor.getNode()) ||
          (currentElementFirstChild &&
            currentElementFirstChild.is(anchor.getNode())));

      if (isBeginning && nodesToMoveLength > 0) {
        currentElement.insertBefore(newElement);
        return;
      }

      let firstChild = null;
      const siblingsToMoveLength = siblingsToMove.length;
      const parent = newElement.getParentOrThrow(); // For inline elements, we append the siblings to the parent.

      if (siblingsToMoveLength > 0) {
        for (let i = 0; i < siblingsToMoveLength; i++) {
          const siblingToMove = siblingsToMove[i];
          parent.append(siblingToMove);
        }
      }

      if (nodesToMoveLength !== 0) {
        for (let i = 0; i < nodesToMoveLength; i++) {
          const nodeToMove = nodesToMove[i];

          if (firstChild === null) {
            newElement.append(nodeToMove);
          } else {
            firstChild.insertBefore(nodeToMove);
          }

          firstChild = nodeToMove;
        }
      }

      if (!newElement.canBeEmpty() && newElement.getChildrenSize() === 0) {
        newElement.selectPrevious();
        newElement.remove();
      } else {
        newElement.selectStart();
      }
    }
  }

  insertLineBreak(selectStart) {
    const lineBreakNode = $createLineBreakNode();
    const anchor = this.anchor;

    if (anchor.type === "element") {
      const element = anchor.getNode();

      if ($isRootNode(element)) {
        this.insertParagraph();
      }
    }

    if (selectStart) {
      this.insertNodes([lineBreakNode], true);
    } else {
      if (this.insertNodes([lineBreakNode])) {
        lineBreakNode.selectNext(0, 0);
      }
    }
  }

  getCharacterOffsets() {
    return getCharacterOffsets(this);
  }

  extract() {
    const selectedNodes = this.getNodes();
    const selectedNodesLength = selectedNodes.length;
    const lastIndex = selectedNodesLength - 1;
    const anchor = this.anchor;
    const focus = this.focus;
    let firstNode = selectedNodes[0];
    let lastNode = selectedNodes[lastIndex];
    const [anchorOffset, focusOffset] = getCharacterOffsets(this);

    if (selectedNodesLength === 0) {
      return [];
    } else if (selectedNodesLength === 1) {
      if ($isTextNode(firstNode)) {
        const startOffset =
          anchorOffset > focusOffset ? focusOffset : anchorOffset;
        const endOffset =
          anchorOffset > focusOffset ? anchorOffset : focusOffset;
        const splitNodes = firstNode.splitText(startOffset, endOffset);
        const node = startOffset === 0 ? splitNodes[0] : splitNodes[1];
        return node != null ? [node] : [];
      }

      return [firstNode];
    }

    const isBefore = anchor.isBefore(focus);

    if ($isTextNode(firstNode)) {
      const startOffset = isBefore ? anchorOffset : focusOffset;

      if (startOffset === firstNode.getTextContentSize()) {
        selectedNodes.shift();
      } else if (startOffset !== 0) {
        [, firstNode] = firstNode.splitText(startOffset);
        selectedNodes[0] = firstNode;
      }
    }

    if ($isTextNode(lastNode)) {
      const lastNodeText = lastNode.getTextContent();
      const lastNodeTextLength = lastNodeText.length;
      const endOffset = isBefore ? focusOffset : anchorOffset;

      if (endOffset === 0) {
        selectedNodes.pop();
      } else if (endOffset !== lastNodeTextLength) {
        [lastNode] = lastNode.splitText(endOffset);
        selectedNodes[lastIndex] = lastNode;
      }
    }

    return selectedNodes;
  }

  modify(alter, isBackward, granularity) {
    const focus = this.focus;
    const anchor = this.anchor;
    const collapse = alter === "move"; // Handle the selection movement around decorators.

    const possibleNode = $getDecoratorNode(focus, isBackward);

    if ($isDecoratorNode(possibleNode) && !possibleNode.isIsolated()) {
      const sibling = isBackward
        ? possibleNode.getPreviousSibling()
        : possibleNode.getNextSibling();

      if (!$isTextNode(sibling)) {
        const parent = possibleNode.getParentOrThrow();
        let offset;
        let elementKey;

        if ($isElementNode(sibling)) {
          elementKey = sibling.__key;
          offset = isBackward ? sibling.getChildrenSize() : 0;
        } else {
          offset = possibleNode.getIndexWithinParent();
          elementKey = parent.__key;

          if (!isBackward) {
            offset++;
          }
        }

        focus.set(elementKey, offset, "element");

        if (collapse) {
          anchor.set(elementKey, offset, "element");
        }

        return;
      } else {
        const siblingKey = sibling.__key;
        const offset = isBackward ? sibling.getTextContent().length : 0;
        focus.set(siblingKey, offset, "text");

        if (collapse) {
          anchor.set(siblingKey, offset, "text");
        }

        return;
      }
    }

    const domSelection = getDOMSelection(); // We use the DOM selection.modify API here to "tell" us what the selection
    // will be. We then use it to update the Lexical selection accordingly. This
    // is much more reliable than waiting for a beforeinput and using the ranges
    // from getTargetRanges(), and is also better than trying to do it ourselves
    // using Intl.Segmenter or other workarounds that struggle with word segments
    // and line segments (especially with word wrapping and non-Roman languages).

    $moveNativeSelection(
      domSelection,
      alter,
      isBackward ? "backward" : "forward",
      granularity
    ); // Guard against no ranges

    if (domSelection.rangeCount > 0) {
      const range = domSelection.getRangeAt(0); // Apply the DOM selection to our Lexical selection.
      // $FlowFixMe[incompatible-call]

      this.applyDOMRange(range); // Because a range works on start and end, we might need to flip
      // the anchor and focus points to match what the DOM has, not what
      // the range has specifically.

      if (
        !collapse &&
        (domSelection.anchorNode !== range.startContainer ||
          domSelection.anchorOffset !== range.startOffset)
      ) {
        $swapPoints(this);
      }
    }
  }

  deleteCharacter(isBackward) {
    if (this.isCollapsed()) {
      const anchor = this.anchor;
      const focus = this.focus;
      let anchorNode = anchor.getNode();

      if (
        !isBackward && // Delete forward handle case
        ((anchor.type === "element" && // $FlowFixMe: always an element node
          anchor.offset === anchorNode.getChildrenSize()) ||
          (anchor.type === "text" &&
            anchor.offset === anchorNode.getTextContentSize()))
      ) {
        const nextSibling =
          anchorNode.getNextSibling() ||
          anchorNode.getParentOrThrow().getNextSibling();

        if ($isElementNode(nextSibling) && !nextSibling.canExtractContents()) {
          return;
        }
      }

      this.modify("extend", isBackward, "character");

      if (!this.isCollapsed()) {
        const focusNode = focus.type === "text" ? focus.getNode() : null;
        anchorNode = anchor.type === "text" ? anchor.getNode() : null;

        if (focusNode !== null && focusNode.isSegmented()) {
          const offset = focus.offset;
          const textContentSize = focusNode.getTextContentSize();

          if (
            focusNode.is(anchorNode) ||
            (isBackward && offset !== textContentSize) ||
            (!isBackward && offset !== 0)
          ) {
            $removeSegment(focusNode, isBackward, offset);
            return;
          }
        } else if (anchorNode !== null && anchorNode.isSegmented()) {
          const offset = anchor.offset;
          const textContentSize = anchorNode.getTextContentSize();

          if (
            anchorNode.is(focusNode) ||
            (isBackward && offset !== 0) ||
            (!isBackward && offset !== textContentSize)
          ) {
            $removeSegment(anchorNode, isBackward, offset);
            return;
          }
        }

        $updateCaretSelectionForUnicodeCharacter(this, isBackward);
      } else if (isBackward && anchor.offset === 0) {
        // Special handling around rich text nodes
        const element =
          anchor.type === "element"
            ? anchor.getNode()
            : anchor.getNode().getParentOrThrow();

        if (element.collapseAtStart(this)) {
          return;
        }
      }
    }

    this.removeText();
  }

  deleteLine(isBackward) {
    if (this.isCollapsed()) {
      this.modify("extend", isBackward, "lineboundary");
    }

    this.removeText();
  }

  deleteWord(isBackward) {
    if (this.isCollapsed()) {
      this.modify("extend", isBackward, "word");
    }

    this.removeText();
  }
}
function $isNodeSelection(x) {
  return x instanceof NodeSelection;
}

function getCharacterOffset(point) {
  const offset = point.offset;

  if (point.type === "text") {
    return offset;
  } // $FlowFixMe: cast

  const parent = point.getNode();
  return offset === parent.getChildrenSize()
    ? parent.getTextContent().length
    : 0;
}

function getCharacterOffsets(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;

  if (
    anchor.type === "element" &&
    focus.type === "element" &&
    anchor.key === focus.key &&
    anchor.offset === focus.offset
  ) {
    return [0, 0];
  }

  return [getCharacterOffset(anchor), getCharacterOffset(focus)];
}

function $swapPoints(selection) {
  const focus = selection.focus;
  const anchor = selection.anchor;
  const anchorKey = anchor.key;
  const anchorOffset = anchor.offset;
  const anchorType = anchor.type;
  $setPointValues(anchor, focus.key, focus.offset, focus.type);
  $setPointValues(focus, anchorKey, anchorOffset, anchorType);
}

function $moveNativeSelection(domSelection, alter, direction, granularity) {
  // $FlowFixMe[prop-missing]
  domSelection.modify(alter, direction, granularity);
}

function $updateCaretSelectionForUnicodeCharacter(selection, isBackward) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();

  if (
    anchorNode === focusNode &&
    anchor.type === "text" &&
    focus.type === "text"
  ) {
    // Handling of multibyte characters
    const anchorOffset = anchor.offset;
    const focusOffset = focus.offset;
    const isBefore = anchorOffset < focusOffset;
    const startOffset = isBefore ? anchorOffset : focusOffset;
    const endOffset = isBefore ? focusOffset : anchorOffset;
    const characterOffset = endOffset - 1;

    if (startOffset !== characterOffset) {
      const text = anchorNode.getTextContent().slice(startOffset, endOffset);

      if (!doesContainGrapheme(text)) {
        if (isBackward) {
          focus.offset = characterOffset;
        } else {
          anchor.offset = characterOffset;
        }
      }
    }
  }
}

function $removeSegment(node, isBackward, offset) {
  const textNode = node;
  const textContent = textNode.getTextContent();
  const split = textContent.split(/\s/g);
  const splitLength = split.length;
  let segmentOffset = 0;
  let restoreOffset = 0;

  for (let i = 0; i < splitLength; i++) {
    const text = split[i];
    const isLast = i === splitLength - 1;
    restoreOffset = segmentOffset;
    segmentOffset += text.length;

    if (
      (isBackward && segmentOffset === offset) ||
      segmentOffset > offset ||
      isLast
    ) {
      split.splice(i, 1);

      if (isLast) {
        restoreOffset = undefined;
      }

      break;
    }
  }

  const nextTextContent = split.join(" ");

  if (nextTextContent === "") {
    textNode.remove();
  } else {
    textNode.setTextContent(nextTextContent);
    textNode.select(restoreOffset, restoreOffset);
  }
}

function shouldResolveAncestor(resolvedElement, resolvedOffset, lastPoint) {
  const parent = resolvedElement.getParent();
  return (
    lastPoint === null ||
    parent === null ||
    !parent.canBeEmpty() ||
    parent !== lastPoint.getNode()
  );
}

function internalResolveSelectionPoint(dom, offset, lastPoint) {
  let resolvedOffset = offset;
  let resolvedNode; // If we have selection on an element, we will
  // need to figure out (using the offset) what text
  // node should be selected.

  if (dom.nodeType === DOM_ELEMENT_TYPE) {
    // Resolve element to a ElementNode, or TextNode, or null
    let moveSelectionToEnd = false; // Given we're moving selection to another node, selection is
    // definitely dirty.
    // We use the anchor to find which child node to select

    const childNodes = dom.childNodes;
    const childNodesLength = childNodes.length; // If the anchor is the same as length, then this means we
    // need to select the very last text node.

    if (resolvedOffset === childNodesLength) {
      moveSelectionToEnd = true;
      resolvedOffset = childNodesLength - 1;
    }

    const childDOM = childNodes[resolvedOffset];
    resolvedNode = getNodeFromDOM(childDOM);

    if ($isTextNode(resolvedNode)) {
      resolvedOffset = getTextNodeOffset(resolvedNode, moveSelectionToEnd);
    } else {
      let resolvedElement = getNodeFromDOM(dom); // Ensure resolvedElement is actually a element.

      if (resolvedElement === null) {
        return null;
      }

      if ($isElementNode(resolvedElement)) {
        let child = resolvedElement.getChildAtIndex(resolvedOffset);

        if (
          $isElementNode(child) &&
          shouldResolveAncestor(child, resolvedOffset, lastPoint)
        ) {
          const descendant = moveSelectionToEnd
            ? child.getLastDescendant()
            : child.getFirstDescendant();

          if (descendant === null) {
            resolvedElement = child;
            resolvedOffset = 0;
          } else {
            child = descendant;
            resolvedElement = child.getParentOrThrow();
          }
        }

        if ($isTextNode(child)) {
          resolvedNode = child;
          resolvedElement = null;
          resolvedOffset = getTextNodeOffset(resolvedNode, moveSelectionToEnd);
        } else if (child !== resolvedElement && moveSelectionToEnd) {
          resolvedOffset++;
        }
      } else {
        const index = resolvedElement.getIndexWithinParent(); // When selecting decorators, there can be some selection issues when using resolvedOffset,
        // and instead we should be checking if we're using the offset

        if (
          offset === 0 &&
          $isDecoratorNode(resolvedElement) &&
          getNodeFromDOM(dom) === resolvedElement
        ) {
          resolvedOffset = index;
        } else {
          resolvedOffset = index + 1;
        }

        resolvedElement = resolvedElement.getParentOrThrow();
      }

      if ($isElementNode(resolvedElement)) {
        return $createPoint(resolvedElement.__key, resolvedOffset, "element");
      }
    }
  } else {
    // TextNode or null
    resolvedNode = getNodeFromDOM(dom);
  }

  if (!$isTextNode(resolvedNode)) {
    return null;
  }

  return $createPoint(resolvedNode.__key, resolvedOffset, "text");
}

function resolveSelectionPointOnBoundary(point, isBackward, isCollapsed) {
  const offset = point.offset;
  const node = point.getNode();

  if (offset === 0) {
    const prevSibling = node.getPreviousSibling();
    const parent = node.getParent();

    if (!isBackward) {
      if (
        $isElementNode(prevSibling) &&
        !isCollapsed &&
        prevSibling.isInline()
      ) {
        point.key = prevSibling.__key;
        point.offset = prevSibling.getChildrenSize(); // $FlowFixMe: intentional

        point.type = "element";
      } else if ($isTextNode(prevSibling) && !prevSibling.isInert()) {
        point.key = prevSibling.__key;
        point.offset = prevSibling.getTextContent().length;
      }
    } else if (
      (isCollapsed || !isBackward) &&
      prevSibling === null &&
      $isElementNode(parent) &&
      parent.isInline()
    ) {
      const parentSibling = parent.getPreviousSibling();

      if ($isTextNode(parentSibling)) {
        point.key = parentSibling.__key;
        point.offset = parentSibling.getTextContent().length;
      }
    }
  } else if (offset === node.getTextContent().length) {
    const nextSibling = node.getNextSibling();
    const parent = node.getParent();

    if (isBackward && $isElementNode(nextSibling) && nextSibling.isInline()) {
      point.key = nextSibling.__key;
      point.offset = 0; // $FlowFixMe: intentional

      point.type = "element";
    } else if (
      (isCollapsed || isBackward) &&
      nextSibling === null &&
      $isElementNode(parent) &&
      parent.isInline()
    ) {
      const parentSibling = parent.getNextSibling();

      if ($isTextNode(parentSibling)) {
        point.key = parentSibling.__key;
        point.offset = 0;
      }
    }
  }
}

function normalizeSelectionPointsForBoundaries(anchor, focus, lastSelection) {
  if (anchor.type === "text" && focus.type === "text") {
    const isBackward = anchor.isBefore(focus);
    const isCollapsed = anchor.is(focus); // Attempt to normalize the offset to the previous sibling if we're at the
    // start of a text node and the sibling is a text node or inline element.

    resolveSelectionPointOnBoundary(anchor, isBackward, isCollapsed);
    resolveSelectionPointOnBoundary(focus, !isBackward, isCollapsed);

    if (isCollapsed) {
      focus.key = anchor.key;
      focus.offset = anchor.offset;
      focus.type = anchor.type;
    }

    const editor = getActiveEditor();

    if (
      editor.isComposing() &&
      editor._compositionKey !== anchor.key &&
      $isRangeSelection(lastSelection)
    ) {
      const lastAnchor = lastSelection.anchor;
      const lastFocus = lastSelection.focus;
      $setPointValues(
        anchor,
        lastAnchor.key,
        lastAnchor.offset,
        lastAnchor.type
      );
      $setPointValues(focus, lastFocus.key, lastFocus.offset, lastFocus.type);
    }
  }
}

function internalResolveSelectionPoints(
  anchorDOM,
  anchorOffset,
  focusDOM,
  focusOffset,
  editor,
  lastSelection
) {
  if (
    anchorDOM === null ||
    focusDOM === null ||
    !isSelectionWithinEditor(editor, anchorDOM, focusDOM)
  ) {
    return null;
  }

  const resolvedAnchorPoint = internalResolveSelectionPoint(
    anchorDOM,
    anchorOffset,
    $isRangeSelection(lastSelection) ? lastSelection.anchor : null
  );

  if (resolvedAnchorPoint === null) {
    return null;
  }

  const resolvedFocusPoint = internalResolveSelectionPoint(
    focusDOM,
    focusOffset,
    $isRangeSelection(lastSelection) ? lastSelection.focus : null
  );

  if (resolvedFocusPoint === null) {
    return null;
  } // Handle normalization of selection when it is at the boundaries.

  normalizeSelectionPointsForBoundaries(
    resolvedAnchorPoint,
    resolvedFocusPoint,
    lastSelection
  );
  return [resolvedAnchorPoint, resolvedFocusPoint];
} // This is used to make a selection when the existing
// selection is null, i.e. forcing selection on the editor
// when it current exists outside the editor.

function internalMakeRangeSelection(
  anchorKey,
  anchorOffset,
  focusKey,
  focusOffset,
  anchorType,
  focusType
) {
  const editorState = getActiveEditorState();
  const selection = new RangeSelection(
    $createPoint(anchorKey, anchorOffset, anchorType),
    $createPoint(focusKey, focusOffset, focusType),
    0
  );
  selection.dirty = true;
  editorState._selection = selection;
  return selection;
}
function $createEmptyRangeSelection() {
  const anchor = $createPoint("root", 0, "element");
  const focus = $createPoint("root", 0, "element");
  return new RangeSelection(anchor, focus, 0);
}
function $createEmptyObjectSelection() {
  return new NodeSelection(new Set());
}
function $createEmptyGridSelection() {
  const anchor = $createPoint("root", 0, "element");
  const focus = $createPoint("root", 0, "element");
  return new GridSelection("root", anchor, focus);
}

function getActiveEventType() {
  const event = window.event;
  return event && event.type;
}

function internalCreateSelection(editor) {
  const currentEditorState = editor.getEditorState();
  const lastSelection = currentEditorState._selection;
  const domSelection = getDOMSelection();

  if ($isNodeSelection(lastSelection) || $isGridSelection(lastSelection)) {
    return lastSelection.clone();
  }

  return internalCreateRangeSelection(lastSelection, domSelection, editor);
}

function internalCreateRangeSelection(lastSelection, domSelection, editor) {
  // When we create a selection, we try to use the previous
  // selection where possible, unless an actual user selection
  // change has occurred. When we do need to create a new selection
  // we validate we can have text nodes for both anchor and focus
  // nodes. If that holds true, we then return that selection
  // as a mutable object that we use for the editor state for this
  // update cycle. If a selection gets changed, and requires a
  // update to native DOM selection, it gets marked as "dirty".
  // If the selection changes, but matches with the existing
  // DOM selection, then we only need to sync it. Otherwise,
  // we generally bail out of doing an update to selection during
  // reconciliation unless there are dirty nodes that need
  // reconciling.
  const eventType = getActiveEventType();
  const isSelectionChange = eventType === "selectionchange";
  const useDOMSelection =
    eventType == null ||
    (!getIsProcesssingMutations() &&
      (isSelectionChange ||
        eventType === "beforeinput" ||
        eventType === "compositionstart" ||
        eventType === "compositionend" ||
        (eventType === "click" && window.event.detail === 3)));
  console.log("internalCreateRangeSelection", { useDOMSelection, eventType });
  let anchorDOM, focusDOM, anchorOffset, focusOffset;

  if (!$isRangeSelection(lastSelection) || useDOMSelection) {
    if (domSelection === null) {
      return null;
    }

    anchorDOM = domSelection.anchorNode;
    focusDOM = domSelection.focusNode;
    anchorOffset = domSelection.anchorOffset;
    focusOffset = domSelection.focusOffset;
  } else {
    return lastSelection.clone();
  } // Let's resolve the text nodes from the offsets and DOM nodes we have from
  // native selection.

  const resolvedSelectionPoints = internalResolveSelectionPoints(
    anchorDOM,
    anchorOffset,
    focusDOM,
    focusOffset,
    editor,
    lastSelection
  );

  if (resolvedSelectionPoints === null) {
    return null;
  }

  const [resolvedAnchorPoint, resolvedFocusPoint] = resolvedSelectionPoints;
  return new RangeSelection(
    resolvedAnchorPoint,
    resolvedFocusPoint,
    !$isRangeSelection(lastSelection) ? 0 : lastSelection.format
  );
}

function $getSelection() {
  const editorState = getActiveEditorState();
  return editorState._selection;
}
function $getPreviousSelection() {
  const editor = getActiveEditor();
  return editor._editorState._selection;
}
function internalCreateSelectionFromParse(parsedSelection) {
  if (parsedSelection !== null) {
    if (parsedSelection.type === "range") {
      return new RangeSelection(
        $createPoint(
          parsedSelection.anchor.key,
          parsedSelection.anchor.offset,
          parsedSelection.anchor.type
        ),
        $createPoint(
          parsedSelection.focus.key,
          parsedSelection.focus.offset,
          parsedSelection.focus.type
        ),
        0
      );
    } else if (parsedSelection.type === "node") {
      return new NodeSelection(new Set(parsedSelection.nodes));
    } else if (parsedSelection.type === "grid") {
      return new GridSelection(
        parsedSelection.gridKey,
        $createPoint(
          parsedSelection.anchor.key,
          parsedSelection.anchor.offset,
          parsedSelection.anchor.type
        ),
        $createPoint(
          parsedSelection.focus.key,
          parsedSelection.focus.offset,
          parsedSelection.focus.type
        )
      );
    }
  }

  return null;
}
function $updateElementSelectionOnCreateDeleteNode(
  selection,
  parentNode,
  nodeOffset,
  times = 1
) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();

  if (!parentNode.is(anchorNode) && !parentNode.is(focusNode)) {
    return;
  }

  const parentKey = parentNode.__key; // Single node. We shift selection but never redimension it

  if (selection.isCollapsed()) {
    const selectionOffset = anchor.offset;

    if (nodeOffset <= selectionOffset) {
      const newSelectionOffset = Math.max(0, selectionOffset + times);
      anchor.set(parentKey, newSelectionOffset, "element");
      focus.set(parentKey, newSelectionOffset, "element"); // The new selection might point to text nodes, try to resolve them

      $updateSelectionResolveTextNodes(selection);
    }

    return;
  } // Multiple nodes selected. We shift or redimension selection

  const isBackward = selection.isBackward();
  const firstPoint = isBackward ? focus : anchor;
  const firstPointNode = firstPoint.getNode();
  const lastPoint = isBackward ? anchor : focus;
  const lastPointNode = lastPoint.getNode();

  if (parentNode.is(firstPointNode)) {
    const firstPointOffset = firstPoint.offset;

    if (nodeOffset <= firstPointOffset) {
      firstPoint.set(
        parentKey,
        Math.max(0, firstPointOffset + times),
        "element"
      );
    }
  }

  if (parentNode.is(lastPointNode)) {
    const lastPointOffset = lastPoint.offset;

    if (nodeOffset <= lastPointOffset) {
      lastPoint.set(parentKey, Math.max(0, lastPointOffset + times), "element");
    }
  } // The new selection might point to text nodes, try to resolve them

  $updateSelectionResolveTextNodes(selection);
}

function $updateSelectionResolveTextNodes(selection) {
  const anchor = selection.anchor;
  const anchorOffset = anchor.offset;
  const focus = selection.focus;
  const focusOffset = focus.offset;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();

  if (selection.isCollapsed()) {
    if (!$isElementNode(anchorNode)) {
      return;
    }

    const childSize = anchorNode.getChildrenSize();
    const anchorOffsetAtEnd = anchorOffset >= childSize;
    const child = anchorOffsetAtEnd
      ? anchorNode.getChildAtIndex(childSize - 1)
      : anchorNode.getChildAtIndex(anchorOffset);

    if ($isTextNode(child)) {
      let newOffset = 0;

      if (anchorOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }

      anchor.set(child.__key, newOffset, "text");
      focus.set(child.__key, newOffset, "text");
    }

    return;
  }

  if ($isElementNode(anchorNode)) {
    const childSize = anchorNode.getChildrenSize();
    const anchorOffsetAtEnd = anchorOffset >= childSize;
    const child = anchorOffsetAtEnd
      ? anchorNode.getChildAtIndex(childSize - 1)
      : anchorNode.getChildAtIndex(anchorOffset);

    if ($isTextNode(child)) {
      let newOffset = 0;

      if (anchorOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }

      anchor.set(child.__key, newOffset, "text");
    }
  }

  if ($isElementNode(focusNode)) {
    const childSize = focusNode.getChildrenSize();
    const focusOffsetAtEnd = focusOffset >= childSize;
    const child = focusOffsetAtEnd
      ? focusNode.getChildAtIndex(childSize - 1)
      : focusNode.getChildAtIndex(focusOffset);

    if ($isTextNode(child)) {
      let newOffset = 0;

      if (focusOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }

      focus.set(child.__key, newOffset, "text");
    }
  }
}

function applySelectionTransforms(nextEditorState, editor) {
  const prevEditorState = editor.getEditorState();
  const prevSelection = prevEditorState._selection;
  const nextSelection = nextEditorState._selection;

  if ($isRangeSelection(nextSelection)) {
    const anchor = nextSelection.anchor;
    const focus = nextSelection.focus;
    let anchorNode;

    if (anchor.type === "text") {
      anchorNode = anchor.getNode();
      anchorNode.selectionTransform(prevSelection, nextSelection);
    }

    if (focus.type === "text") {
      const focusNode = focus.getNode();

      if (anchorNode !== focusNode) {
        focusNode.selectionTransform(prevSelection, nextSelection);
      }
    }
  }
}
function moveSelectionPointToSibling(
  point,
  node,
  parent,
  prevSibling,
  nextSibling
) {
  let siblingKey = null;
  let offset = 0;
  let type = null;

  if (prevSibling !== null) {
    siblingKey = prevSibling.__key;

    if ($isTextNode(prevSibling)) {
      offset = prevSibling.getTextContentSize();
      type = "text";
    } else if ($isElementNode(prevSibling)) {
      offset = prevSibling.getChildrenSize();
      type = "element";
    }
  } else {
    if (nextSibling !== null) {
      siblingKey = nextSibling.__key;

      if ($isTextNode(nextSibling)) {
        type = "text";
      } else if ($isElementNode(nextSibling)) {
        type = "element";
      }
    }
  }

  if (siblingKey !== null && type !== null) {
    point.set(siblingKey, offset, type);
  } else {
    offset = node.getIndexWithinParent();

    if (offset === -1) {
      // Move selection to end of parent
      offset = parent.getChildrenSize();
    }

    point.set(parent.__key, offset, "element");
  }
}
function adjustPointOffsetForMergedSibling(
  point,
  isBefore,
  key,
  target,
  textLength
) {
  if (point.type === "text") {
    point.key = key;

    if (!isBefore) {
      point.offset += textLength;
    }
  } else if (point.offset > target.getIndexWithinParent()) {
    point.offset -= 1;
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function removeNode(nodeToRemove, restoreSelection, preserveEmptyParent) {
  errorOnReadOnly();
  const key = nodeToRemove.__key;
  const parent = nodeToRemove.getParent();

  if (parent === null) {
    return;
  }

  const selection = $getSelection();
  let selectionMoved = false;

  if ($isRangeSelection(selection) && restoreSelection) {
    const anchor = selection.anchor;
    const focus = selection.focus;

    if (anchor.key === key) {
      moveSelectionPointToSibling(
        anchor,
        nodeToRemove,
        parent,
        nodeToRemove.getPreviousSibling(),
        nodeToRemove.getNextSibling()
      );
      selectionMoved = true;
    }

    if (focus.key === key) {
      moveSelectionPointToSibling(
        focus,
        nodeToRemove,
        parent,
        nodeToRemove.getPreviousSibling(),
        nodeToRemove.getNextSibling()
      );
      selectionMoved = true;
    }
  }

  const writableParent = parent.getWritable();
  const parentChildren = writableParent.__children;
  const index = parentChildren.indexOf(key);

  if (index === -1) {
    {
      throw Error(`Node is not a child of its parent`);
    }
  }

  internalMarkSiblingsAsDirty(nodeToRemove);
  parentChildren.splice(index, 1);
  const writableNodeToRemove = nodeToRemove.getWritable();
  writableNodeToRemove.__parent = null;

  if ($isRangeSelection(selection) && restoreSelection && !selectionMoved) {
    $updateElementSelectionOnCreateDeleteNode(selection, parent, index, -1);
  }

  if (
    !preserveEmptyParent &&
    parent !== null &&
    !$isRootNode(parent) &&
    !parent.canBeEmpty() &&
    parent.isEmpty()
  ) {
    removeNode(parent, restoreSelection);
  }

  if (parent !== null && $isRootNode(parent) && parent.isEmpty()) {
    parent.selectEnd();
  }
}
function $getNodeByKeyOrThrow(key) {
  const node = $getNodeByKey(key);

  if (node === null) {
    {
      throw Error(
        `Expected node with key ${key} to exist but it's not in the nodeMap.`
      );
    }
  }

  return node;
}
class LexicalNode {
  // Flow doesn't support abstract classes unfortunately, so we can't _force_
  // subclasses of Node to implement statics. All subclasses of Node should have
  // a static getType and clone method though. We define getType and clone here so we can call it
  // on any  Node, and we throw this error by default since the subclass should provide
  // their own implementation.
  static getType() {
    {
      throw Error(
        `LexicalNode: Node ${this.name} does not implement .getType().`
      );
    }
  }

  static clone(data) {
    {
      throw Error(
        `LexicalNode: Node ${this.name} does not implement .clone().`
      );
    }
  }

  constructor(key) {
    this.__type = this.constructor.getType();
    this.__parent = null;
    $setNodeKey(this, key); // Ensure custom nodes implement required methods.

    {
      const proto = Object.getPrototypeOf(this);
      ["getType", "clone"].forEach((method) => {
        if (!proto.constructor.hasOwnProperty(method)) {
          console.warn(
            `${this.constructor.name} must implement static "${method}" method`
          );
        }
      });

      if (this.__type !== "root") {
        errorOnReadOnly();
        errorOnTypeKlassMismatch(this.__type, this.constructor);
      }
    }
  } // Getters and Traversers

  getType() {
    return this.__type;
  }

  isAttached() {
    let nodeKey = this.__key;

    while (nodeKey !== null) {
      if (nodeKey === "root") {
        return true;
      }

      const node = $getNodeByKey(nodeKey);

      if (node === null) {
        break;
      }

      nodeKey = node.__parent;
    }

    return false;
  }

  isSelected() {
    const selection = $getSelection();

    if (selection == null) {
      return false;
    }

    const selectedNodeKeys = new Set(selection.getNodes().map((n) => n.__key));
    const isSelected = selectedNodeKeys.has(this.__key);

    if ($isTextNode(this)) {
      return isSelected;
    } // For inline images inside of element nodes.
    // Without this change the image will be selected if the cursor is before or after it.

    if (
      $isRangeSelection(selection) &&
      selection.anchor.type === "element" &&
      selection.focus.type === "element" &&
      selection.anchor.key === selection.focus.key &&
      selection.anchor.offset === selection.focus.offset
    ) {
      return false;
    }

    return isSelected;
  }

  getKey() {
    // Key is stable between copies
    return this.__key;
  }

  getIndexWithinParent() {
    const parent = this.getParent();

    if (parent === null) {
      return -1;
    }

    const children = parent.__children;
    return children.indexOf(this.__key);
  }

  getParent() {
    const parent = this.getLatest().__parent;

    if (parent === null) {
      return null;
    }

    return $getNodeByKey(parent);
  }

  getParentOrThrow() {
    const parent = this.getParent();

    if (parent === null) {
      {
        throw Error(`Expected node ${this.__key} to have a parent.`);
      }
    }

    return parent;
  }

  getTopLevelElement() {
    let node = this;

    while (node !== null) {
      const parent = node.getParent();

      if ($isRootNode(parent) && $isElementNode(node)) {
        return node;
      }

      node = parent;
    }

    return null;
  }

  getTopLevelElementOrThrow() {
    const parent = this.getTopLevelElement();

    if (parent === null) {
      {
        throw Error(
          `Expected node ${this.__key} to have a top parent element.`
        );
      }
    }

    return parent;
  }

  getParents() {
    const parents = [];
    let node = this.getParent();

    while (node !== null) {
      parents.push(node);
      node = node.getParent();
    }

    return parents;
  }

  getParentKeys() {
    const parents = [];
    let node = this.getParent();

    while (node !== null) {
      parents.push(node.__key);
      node = node.getParent();
    }

    return parents;
  }

  getPreviousSibling() {
    const parent = this.getParent();

    if (parent === null) {
      return null;
    }

    const children = parent.__children;
    const index = children.indexOf(this.__key);

    if (index <= 0) {
      return null;
    }

    return $getNodeByKey(children[index - 1]);
  }

  getPreviousSiblings() {
    const parent = this.getParent();

    if (parent === null) {
      return [];
    }

    const children = parent.__children;
    const index = children.indexOf(this.__key);
    return children
      .slice(0, index)
      .map((childKey) => $getNodeByKeyOrThrow(childKey));
  }

  getNextSibling() {
    const parent = this.getParent();

    if (parent === null) {
      return null;
    }

    const children = parent.__children;
    const childrenLength = children.length;
    const index = children.indexOf(this.__key);

    if (index >= childrenLength - 1) {
      return null;
    }

    return $getNodeByKey(children[index + 1]);
  }

  getNextSiblings() {
    const parent = this.getParent();

    if (parent === null) {
      return [];
    }

    const children = parent.__children;
    const index = children.indexOf(this.__key);
    return children
      .slice(index + 1)
      .map((childKey) => $getNodeByKeyOrThrow(childKey));
  }

  getCommonAncestor(node) {
    const a = this.getParents();
    const b = node.getParents();

    if ($isElementNode(this)) {
      a.unshift(this);
    }

    if ($isElementNode(node)) {
      b.unshift(node);
    }

    const aLength = a.length;
    const bLength = b.length;

    if (aLength === 0 || bLength === 0 || a[aLength - 1] !== b[bLength - 1]) {
      return null;
    }

    const bSet = new Set(b);

    for (let i = 0; i < aLength; i++) {
      const ancestor = a[i];

      if (bSet.has(ancestor)) {
        return ancestor;
      }
    }

    return null;
  }

  is(object) {
    if (object == null) {
      return false;
    }

    return this.__key === object.__key;
  }

  isBefore(targetNode) {
    if (targetNode.isParentOf(this)) {
      return true;
    }

    if (this.isParentOf(targetNode)) {
      return false;
    }

    const commonAncestor = this.getCommonAncestor(targetNode);
    let indexA = 0;
    let indexB = 0;
    let node = this;

    while (true) {
      const parent = node.getParentOrThrow();

      if (parent === commonAncestor) {
        indexA = parent.__children.indexOf(node.__key);
        break;
      }

      node = parent;
    }

    node = targetNode;

    while (true) {
      const parent = node.getParentOrThrow();

      if (parent === commonAncestor) {
        indexB = parent.__children.indexOf(node.__key);
        break;
      }

      node = parent;
    }

    return indexA < indexB;
  }

  isParentOf(targetNode) {
    const key = this.__key;

    if (key === targetNode.__key) {
      return false;
    }

    let node = targetNode;

    while (node !== null) {
      if (node.__key === key) {
        return true;
      }

      node = node.getParent();
    }

    return false;
  }

  getNodesBetween(targetNode) {
    const isBefore = this.isBefore(targetNode);
    const nodes = [];
    const visited = new Set();
    let node = this;
    let dfsAncestor = null;

    while (true) {
      const key = node.__key;

      if (!visited.has(key)) {
        visited.add(key);
        nodes.push(node);
      }

      if (node === targetNode) {
        break;
      }

      const child = $isElementNode(node)
        ? isBefore
          ? node.getFirstChild()
          : node.getLastChild()
        : null;

      if (child !== null) {
        if (dfsAncestor === null) {
          dfsAncestor = node;
        }

        node = child;
        continue;
      }

      const nextSibling = isBefore
        ? node.getNextSibling()
        : node.getPreviousSibling();

      if (nextSibling !== null) {
        node = nextSibling;
        continue;
      }

      const parent = node.getParentOrThrow();

      if (!visited.has(parent.__key)) {
        nodes.push(parent);
      }

      if (parent === targetNode) {
        break;
      }

      let parentSibling = null;
      let ancestor = parent;

      if (parent.is(dfsAncestor)) {
        dfsAncestor = null;
      }

      do {
        if (ancestor === null) {
          {
            throw Error(`getNodesBetween: ancestor is null`);
          }
        }

        parentSibling = isBefore
          ? ancestor.getNextSibling()
          : ancestor.getPreviousSibling();
        ancestor = ancestor.getParent();

        if (ancestor !== null) {
          if (ancestor.is(dfsAncestor)) {
            dfsAncestor = null;
          }

          if (parentSibling === null && !visited.has(ancestor.__key)) {
            nodes.push(ancestor);
          }
        }
      } while (parentSibling === null);

      node = parentSibling;
    }

    if (!isBefore) {
      nodes.reverse();
    }

    return nodes;
  }

  isDirty() {
    const editor = getActiveEditor();
    const dirtyLeaves = editor._dirtyLeaves;
    return dirtyLeaves !== null && dirtyLeaves.has(this.__key);
  } // TODO remove this and move to TextNode

  isComposing() {
    return this.__key === $getCompositionKey();
  }

  getLatest() {
    const latest = $getNodeByKey(this.__key);

    if (latest === null) {
      {
        throw Error(`getLatest: node not found`);
      }
    }

    return latest;
  } // $FlowFixMe this is LexicalNode

  getWritable() {
    errorOnReadOnly();
    const editorState = getActiveEditorState();
    const editor = getActiveEditor();
    const nodeMap = editorState._nodeMap;
    const key = this.__key; // Ensure we get the latest node from pending state

    const latestNode = this.getLatest();
    const parent = latestNode.__parent;
    const cloneNotNeeded = editor._cloneNotNeeded;

    if (cloneNotNeeded.has(key)) {
      // Transforms clear the dirty node set on each iteration to keep track on newly dirty nodes
      internalMarkNodeAsDirty(latestNode);
      return latestNode;
    }

    const constructor = latestNode.constructor;
    const mutableNode = constructor.clone(latestNode);
    mutableNode.__parent = parent;

    if ($isElementNode(latestNode) && $isElementNode(mutableNode)) {
      mutableNode.__children = Array.from(latestNode.__children);
      mutableNode.__indent = latestNode.__indent;
      mutableNode.__format = latestNode.__format;
      mutableNode.__dir = latestNode.__dir;
    } else if ($isTextNode(latestNode) && $isTextNode(mutableNode)) {
      const marks = latestNode.__marks;
      mutableNode.__format = latestNode.__format;
      mutableNode.__style = latestNode.__style;
      mutableNode.__mode = latestNode.__mode;
      mutableNode.__detail = latestNode.__detail;
      mutableNode.__marks = marks === null ? marks : Array.from(marks);
    }

    cloneNotNeeded.add(key);
    mutableNode.__key = key;
    internalMarkNodeAsDirty(mutableNode); // Update reference in node map

    nodeMap.set(key, mutableNode); // $FlowFixMe this is LexicalNode

    return mutableNode;
  } // TODO remove this completely

  getTextContent(includeInert, includeDirectionless) {
    return "";
  } // TODO remove this completely

  getTextContentSize(includeInert, includeDirectionless) {
    return this.getTextContent(includeInert, includeDirectionless).length;
  } // View

  createDOM(config, editor) {
    {
      throw Error(`createDOM: base method not extended`);
    }
  }

  updateDOM(prevNode, dom, config) {
    // $FlowFixMe: TODO
    {
      throw Error(`updateDOM: base method not extended`);
    }
  }

  exportDOM(editor) {
    if ($isDecoratorNode(this)) {
      const element = editor.getElementByKey(this.getKey());
      return {
        element: element ? element.cloneNode() : null,
      };
    }

    const element = this.createDOM(editor._config, editor);
    return {
      element,
    };
  }

  static importDOM() {
    return null;
  } // Setters and mutators

  remove(preserveEmptyParent) {
    errorOnReadOnly();
    removeNode(this, true, preserveEmptyParent);
  }

  replace(replaceWith) {
    errorOnReadOnly();
    const toReplaceKey = this.__key;
    const writableReplaceWith = replaceWith.getWritable();
    removeFromParent(writableReplaceWith);
    const newParent = this.getParentOrThrow();
    const writableParent = newParent.getWritable();
    const children = writableParent.__children;
    const index = children.indexOf(this.__key);
    const newKey = writableReplaceWith.__key;

    if (index === -1) {
      {
        throw Error(`Node is not a child of its parent`);
      }
    }

    children.splice(index, 0, newKey);
    writableReplaceWith.__parent = newParent.__key;
    removeNode(this, false);
    internalMarkSiblingsAsDirty(writableReplaceWith);
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;

      if (anchor.key === toReplaceKey) {
        $moveSelectionPointToEnd(anchor, writableReplaceWith);
      }

      if (focus.key === toReplaceKey) {
        $moveSelectionPointToEnd(focus, writableReplaceWith);
      }
    }

    if ($getCompositionKey() === toReplaceKey) {
      $setCompositionKey(newKey);
    }

    return writableReplaceWith;
  }

  insertAfter(nodeToInsert) {
    errorOnReadOnly();
    const writableSelf = this.getWritable();
    const writableNodeToInsert = nodeToInsert.getWritable();
    const oldParent = writableNodeToInsert.getParent();
    const selection = $getSelection();
    const oldIndex = nodeToInsert.getIndexWithinParent();
    let elementAnchorSelectionOnNode = false;
    let elementFocusSelectionOnNode = false;

    if (oldParent !== null) {
      removeFromParent(writableNodeToInsert);

      if ($isRangeSelection(selection)) {
        const oldParentKey = oldParent.__key;
        const anchor = selection.anchor;
        const focus = selection.focus;
        elementAnchorSelectionOnNode =
          anchor.type === "element" &&
          anchor.key === oldParentKey &&
          anchor.offset === oldIndex + 1;
        elementFocusSelectionOnNode =
          focus.type === "element" &&
          focus.key === oldParentKey &&
          focus.offset === oldIndex + 1;
      }
    }

    const writableParent = this.getParentOrThrow().getWritable();
    const insertKey = writableNodeToInsert.__key;
    writableNodeToInsert.__parent = writableSelf.__parent;
    const children = writableParent.__children;
    const index = children.indexOf(writableSelf.__key);

    if (index === -1) {
      {
        throw Error(`Node is not a child of its parent`);
      }
    }

    children.splice(index + 1, 0, insertKey);
    internalMarkSiblingsAsDirty(writableNodeToInsert);

    if ($isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(
        selection,
        writableParent,
        index + 1
      );
      const writableParentKey = writableParent.__key;

      if (elementAnchorSelectionOnNode) {
        selection.anchor.set(writableParentKey, index + 2, "element");
      }

      if (elementFocusSelectionOnNode) {
        selection.focus.set(writableParentKey, index + 2, "element");
      }
    }

    return nodeToInsert;
  }

  insertBefore(nodeToInsert) {
    errorOnReadOnly();
    const writableSelf = this.getWritable();
    const writableNodeToInsert = nodeToInsert.getWritable();
    removeFromParent(writableNodeToInsert);
    const writableParent = this.getParentOrThrow().getWritable();
    const insertKey = writableNodeToInsert.__key;
    writableNodeToInsert.__parent = writableSelf.__parent;
    const children = writableParent.__children;
    const index = children.indexOf(writableSelf.__key);

    if (index === -1) {
      {
        throw Error(`Node is not a child of its parent`);
      }
    }

    children.splice(index, 0, insertKey);
    internalMarkSiblingsAsDirty(writableNodeToInsert);
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(
        selection,
        writableParent,
        index
      );
    }

    return nodeToInsert;
  }

  selectPrevious(anchorOffset, focusOffset) {
    errorOnReadOnly();
    const prevSibling = this.getPreviousSibling();
    const parent = this.getParentOrThrow();

    if (prevSibling === null) {
      return parent.select(0, 0);
    }

    if ($isElementNode(prevSibling)) {
      return prevSibling.select();
    } else if (!$isTextNode(prevSibling)) {
      const index = prevSibling.getIndexWithinParent() + 1;
      return parent.select(index, index);
    }

    return prevSibling.select(anchorOffset, focusOffset);
  }

  selectNext(anchorOffset, focusOffset) {
    errorOnReadOnly();
    const nextSibling = this.getNextSibling();
    const parent = this.getParentOrThrow();

    if (nextSibling === null) {
      return parent.select();
    }

    if ($isElementNode(nextSibling)) {
      return nextSibling.select(0, 0);
    } else if (!$isTextNode(nextSibling)) {
      const index = nextSibling.getIndexWithinParent();
      return parent.select(index, index);
    }

    return nextSibling.select(anchorOffset, focusOffset);
  } // Proxy to mark something as dirty

  markDirty() {
    this.getWritable();
  }
}

function errorOnTypeKlassMismatch(type, klass) {
  const registeredNode = getActiveEditor()._nodes.get(type); // Common error - split in its own invariant

  if (registeredNode === undefined) {
    {
      throw Error(
        `Create node: Attempted to create node ${klass.name} that was not previously registered on the editor. You can use register your custom nodes.`
      );
    }
  }

  const editorKlass = registeredNode.klass;

  if (editorKlass !== klass) {
    {
      throw Error(
        `Create node: Type ${type} in node ${klass.name} does not match registered node ${editorKlass.name} with the same type`
      );
    }
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class DecoratorNode extends LexicalNode {
  constructor(key) {
    super(key); // ensure custom nodes implement required methods

    {
      const proto = Object.getPrototypeOf(this);
      ["decorate"].forEach((method) => {
        if (!proto.hasOwnProperty(method)) {
          console.warn(
            `${this.constructor.name} must implement "${method}" method`
          );
        }
      });
    }
  }

  decorate(editor) {
    {
      throw Error(`decorate: base method not extended`);
    }
  }

  isIsolated() {
    return false;
  }

  isTopLevel() {
    return false;
  }
}
function $isDecoratorNode(node) {
  return node instanceof DecoratorNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class ElementNode extends LexicalNode {
  constructor(key) {
    super(key);
    this.__children = [];
    this.__format = 0;
    this.__indent = 0;
    this.__dir = null;
  }

  getFormat() {
    const self = this.getLatest();
    return self.__format;
  }

  getIndent() {
    const self = this.getLatest();
    return self.__indent;
  }

  getChildren() {
    const self = this.getLatest();
    const children = self.__children;
    const childrenNodes = [];

    for (let i = 0; i < children.length; i++) {
      const childNode = $getNodeByKey(children[i]);

      if (childNode !== null) {
        childrenNodes.push(childNode);
      }
    }

    return childrenNodes;
  }

  getChildrenKeys() {
    return this.getLatest().__children;
  }

  getChildrenSize() {
    const self = this.getLatest();
    return self.__children.length;
  }

  isEmpty() {
    return this.getChildrenSize() === 0;
  }

  isDirty() {
    const editor = getActiveEditor();
    const dirtyElements = editor._dirtyElements;
    return dirtyElements !== null && dirtyElements.has(this.__key);
  }

  isLastChild() {
    const self = this.getLatest();
    const parent = self.getParentOrThrow();
    return parent.getLastChild() === self;
  }

  getAllTextNodes(includeInert) {
    const textNodes = [];
    const self = this.getLatest();
    const children = self.__children;

    for (let i = 0; i < children.length; i++) {
      const childNode = $getNodeByKey(children[i]);

      if ($isTextNode(childNode) && (includeInert || !childNode.isInert())) {
        textNodes.push(childNode);
      } else if ($isElementNode(childNode)) {
        const subChildrenNodes = childNode.getAllTextNodes(includeInert);
        textNodes.push(...subChildrenNodes);
      }
    }

    return textNodes;
  }

  getFirstDescendant() {
    let node = this.getFirstChild();

    while (node !== null) {
      if ($isElementNode(node)) {
        const child = node.getFirstChild();

        if (child !== null) {
          node = child;
          continue;
        }
      }

      break;
    }

    return node;
  }

  getLastDescendant() {
    let node = this.getLastChild();

    while (node !== null) {
      if ($isElementNode(node)) {
        const child = node.getLastChild();

        if (child !== null) {
          node = child;
          continue;
        }
      }

      break;
    }

    return node;
  }

  getDescendantByIndex(index) {
    const children = this.getChildren();
    const childrenLength = children.length;

    if (childrenLength === 0) {
      return this;
    } // For non-empty element nodes, we resolve its descendant
    // (either a leaf node or the bottom-most element)

    if (index >= childrenLength) {
      const resolvedNode = children[childrenLength - 1];
      return (
        ($isElementNode(resolvedNode) && resolvedNode.getLastDescendant()) ||
        resolvedNode
      );
    }

    const resolvedNode = children[index];
    return (
      ($isElementNode(resolvedNode) && resolvedNode.getFirstDescendant()) ||
      resolvedNode
    );
  }

  getFirstChild() {
    const self = this.getLatest();
    const children = self.__children;
    const childrenLength = children.length;

    if (childrenLength === 0) {
      return null;
    }

    return $getNodeByKey(children[0]);
  }

  getFirstChildOrThrow() {
    const firstChild = this.getFirstChild();

    if (firstChild === null) {
      {
        throw Error(`Expected node ${this.__key} to have a first child.`);
      }
    }

    return firstChild;
  }

  getLastChild() {
    const self = this.getLatest();
    const children = self.__children;
    const childrenLength = children.length;

    if (childrenLength === 0) {
      return null;
    }

    return $getNodeByKey(children[childrenLength - 1]);
  }

  getChildAtIndex(index) {
    const self = this.getLatest();
    const children = self.__children;
    const key = children[index];

    if (key === undefined) {
      return null;
    }

    return $getNodeByKey(key);
  }

  getTextContent(includeInert, includeDirectionless) {
    let textContent = "";
    const children = this.getChildren();
    const childrenLength = children.length;

    for (let i = 0; i < childrenLength; i++) {
      const child = children[i];
      textContent += child.getTextContent(includeInert, includeDirectionless);

      if (
        $isElementNode(child) &&
        i !== childrenLength - 1 &&
        !child.isInline()
      ) {
        textContent += DOUBLE_LINE_BREAK;
      }
    }

    return textContent;
  }

  getDirection() {
    const self = this.getLatest();
    return self.__dir;
  }

  hasFormat(type) {
    const formatFlag = ELEMENT_TYPE_TO_FORMAT[type];
    return (this.getFormat() & formatFlag) !== 0;
  } // Mutators

  select(_anchorOffset, _focusOffset) {
    errorOnReadOnly();
    const selection = $getSelection();
    let anchorOffset = _anchorOffset;
    let focusOffset = _focusOffset;
    const childrenCount = this.getChildrenSize();

    if (anchorOffset === undefined) {
      anchorOffset = childrenCount;
    }

    if (focusOffset === undefined) {
      focusOffset = childrenCount;
    }

    const key = this.__key;

    if (!$isRangeSelection(selection)) {
      return internalMakeRangeSelection(
        key,
        anchorOffset,
        key,
        focusOffset,
        "element",
        "element"
      );
    } else {
      selection.anchor.set(key, anchorOffset, "element");
      selection.focus.set(key, focusOffset, "element");
      selection.dirty = true;
    }

    return selection;
  }

  selectStart() {
    const firstNode = this.getFirstDescendant();

    if ($isElementNode(firstNode) || $isTextNode(firstNode)) {
      return firstNode.select(0, 0);
    } // Decorator or LineBreak

    if (firstNode !== null) {
      return firstNode.selectPrevious();
    }

    return this.select(0, 0);
  }

  selectEnd() {
    const lastNode = this.getLastDescendant();

    if ($isElementNode(lastNode) || $isTextNode(lastNode)) {
      return lastNode.select();
    } // Decorator or LineBreak

    if (lastNode !== null) {
      return lastNode.selectNext();
    }

    return this.select();
  }

  clear() {
    errorOnReadOnly();
    const writableSelf = this.getWritable();
    const children = this.getChildren();
    children.forEach((child) => child.remove());
    return writableSelf;
  }

  append(...nodesToAppend) {
    errorOnReadOnly();
    return this.splice(this.getChildrenSize(), 0, nodesToAppend);
  }

  setDirection(direction) {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__dir = direction;
    return self;
  }

  setFormat(type) {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__format = ELEMENT_TYPE_TO_FORMAT[type];
    return this;
  }

  setIndent(indentLevel) {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__indent = indentLevel;
    return this;
  }

  splice(start, deleteCount, nodesToInsert) {
    errorOnReadOnly();
    const writableSelf = this.getWritable();
    const writableSelfKey = writableSelf.__key;
    const writableSelfChildren = writableSelf.__children;
    const nodesToInsertLength = nodesToInsert.length;
    const nodesToInsertKeys = []; // Remove nodes to insert from their previous parent

    for (let i = 0; i < nodesToInsertLength; i++) {
      const nodeToInsert = nodesToInsert[i];
      const writableNodeToInsert = nodeToInsert.getWritable();

      if (nodeToInsert.__key === writableSelfKey) {
        {
          throw Error(`append: attemtping to append self`);
        }
      }

      removeFromParent(writableNodeToInsert); // Set child parent to self

      writableNodeToInsert.__parent = writableSelfKey;
      const newKey = writableNodeToInsert.__key;
      nodesToInsertKeys.push(newKey);
    } // Mark range edges siblings as dirty

    const nodeBeforeRange = this.getChildAtIndex(start - 1);

    if (nodeBeforeRange) {
      internalMarkNodeAsDirty(nodeBeforeRange);
    }

    const nodeAfterRange = this.getChildAtIndex(start + deleteCount);

    if (nodeAfterRange) {
      internalMarkNodeAsDirty(nodeAfterRange);
    } // Remove defined range of children

    let nodesToRemoveKeys; // Using faster push when only appending nodes

    if (start === writableSelfChildren.length) {
      writableSelfChildren.push(...nodesToInsertKeys);
      nodesToRemoveKeys = [];
    } else {
      nodesToRemoveKeys = writableSelfChildren.splice(
        start,
        deleteCount,
        ...nodesToInsertKeys
      );
    } // In case of deletion we need to adjust selection, unlink removed nodes
    // and clean up node itself if it becomes empty. None of these needed
    // for insertion-only cases

    if (nodesToRemoveKeys.length) {
      // Adjusting selection, in case node that was anchor/focus will be deleted
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const nodesToRemoveKeySet = new Set(nodesToRemoveKeys);
        const nodesToInsertKeySet = new Set(nodesToInsertKeys);

        const isPointRemoved = (point) => {
          let node = point.getNode();

          while (node) {
            const nodeKey = node.__key;

            if (
              nodesToRemoveKeySet.has(nodeKey) &&
              !nodesToInsertKeySet.has(nodeKey)
            ) {
              return true;
            }

            node = node.getParent();
          }

          return false;
        };

        const { anchor, focus } = selection;

        if (isPointRemoved(anchor)) {
          moveSelectionPointToSibling(
            anchor,
            anchor.getNode(),
            this,
            nodeBeforeRange,
            nodeAfterRange
          );
        }

        if (isPointRemoved(focus)) {
          moveSelectionPointToSibling(
            focus,
            focus.getNode(),
            this,
            nodeBeforeRange,
            nodeAfterRange
          );
        } // Unlink removed nodes from current parent

        const nodesToRemoveKeysLength = nodesToRemoveKeys.length;

        for (let i = 0; i < nodesToRemoveKeysLength; i++) {
          const nodeToRemove = $getNodeByKey(nodesToRemoveKeys[i]);

          if (nodeToRemove != null) {
            const writableNodeToRemove = nodeToRemove.getWritable();
            writableNodeToRemove.__parent = null;
          }
        } // Cleanup if node can't be empty

        if (
          writableSelfChildren.length === 0 &&
          !this.canBeEmpty() &&
          !$isRootNode(this)
        ) {
          this.remove();
        }
      }
    }

    return writableSelf;
  } // These are intended to be extends for specific element heuristics.

  insertNewAfter(selection) {
    return null;
  }

  canInsertTab() {
    return false;
  }

  canIndent() {
    return true;
  }

  collapseAtStart(selection) {
    return false;
  }

  excludeFromCopy() {
    return false;
  }

  canExtractContents() {
    return true;
  }

  canReplaceWith(replacement) {
    return true;
  }

  canInsertAfter(node) {
    return true;
  }

  canBeEmpty() {
    return true;
  }

  canInsertTextBefore() {
    return true;
  }

  canInsertTextAfter() {
    return true;
  }

  isInline() {
    return false;
  }

  canMergeWith(node) {
    return false;
  }
}
function $isElementNode(node) {
  return node instanceof ElementNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class RootNode extends ElementNode {
  static getType() {
    return "root";
  }

  static clone() {
    return new RootNode();
  }

  constructor() {
    super("root");
    this.__cachedText = null;
  }

  getTopLevelElementOrThrow() {
    {
      throw Error(
        `getTopLevelElementOrThrow: root nodes are not top level elements`
      );
    }
  }

  getTextContent(includeInert, includeDirectionless) {
    const cachedText = this.__cachedText;

    if (
      isCurrentlyReadOnlyMode() ||
      getActiveEditor()._dirtyType === NO_DIRTY_NODES
    ) {
      if (
        cachedText !== null &&
        (!includeInert || includeDirectionless !== false)
      ) {
        return cachedText;
      }
    }

    return super.getTextContent(includeInert, includeDirectionless);
  }

  remove() {
    {
      throw Error(`remove: cannot be called on root nodes`);
    }
  }

  replace(node) {
    {
      throw Error(`replace: cannot be called on root nodes`);
    }
  }

  insertBefore(nodeToInsert) {
    {
      throw Error(`insertBefore: cannot be called on root nodes`);
    }
  }

  insertAfter(node) {
    {
      throw Error(`insertAfter: cannot be called on root nodes`);
    }
  } // View

  updateDOM(prevNode, dom) {
    return false;
  } // Mutate

  append(...nodesToAppend) {
    for (let i = 0; i < nodesToAppend.length; i++) {
      const node = nodesToAppend[i];

      if (!$isElementNode(node) && !$isDecoratorNode(node)) {
        {
          throw Error(
            `rootNode.append: Only element or decorator nodes can be appended to the root node`
          );
        }
      }
    }

    return super.append(...nodesToAppend);
  }

  toJSON() {
    return {
      __children: this.__children,
      __dir: this.__dir,
      __format: this.__format,
      __indent: this.__indent,
      __key: "root",
      __parent: null,
      __type: "root",
    };
  }
}
function $createRootNode() {
  return new RootNode();
}
function $isRootNode(node) {
  return node instanceof RootNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function editorStateHasDirtySelection(editorState, editor) {
  const currentSelection = editor.getEditorState()._selection;

  const pendingSelection = editorState._selection; // Check if we need to update because of changes in selection

  if (pendingSelection !== null) {
    if (pendingSelection.dirty || !pendingSelection.is(currentSelection)) {
      return true;
    }
  } else if (currentSelection !== null) {
    return true;
  }

  return false;
}
function cloneEditorState(current) {
  return new EditorState(new Map(current._nodeMap));
}
function createEmptyEditorState() {
  return new EditorState(new Map([["root", $createRootNode()]]));
}
class EditorState {
  constructor(nodeMap, selection) {
    this._nodeMap = nodeMap;
    this._selection = selection || null;
    this._flushSync = false;
    this._readOnly = false;
  }

  isEmpty() {
    return this._nodeMap.size === 1 && this._selection === null;
  }

  read(callbackFn) {
    return readEditorState(this, callbackFn);
  }

  clone(selection) {
    const editorState = new EditorState(
      this._nodeMap,
      selection === undefined ? this._selection : selection
    );
    editorState._readOnly = true;
    return editorState;
  }

  toJSON(space) {
    const selection = this._selection;
    return {
      _nodeMap: Array.from(this._nodeMap.entries()),
      _selection: $isRangeSelection(selection)
        ? {
            anchor: {
              key: selection.anchor.key,
              offset: selection.anchor.offset,
              type: selection.anchor.type,
            },
            focus: {
              key: selection.focus.key,
              offset: selection.focus.offset,
              type: selection.focus.type,
            },
            type: "range",
          }
        : $isNodeSelection(selection)
        ? {
            nodes: Array.from(selection._nodes),
            type: "node",
          }
        : $isGridSelection(selection)
        ? {
            anchor: {
              key: selection.anchor.key,
              offset: selection.anchor.offset,
              type: selection.anchor.type,
            },
            focus: {
              key: selection.focus.key,
              offset: selection.focus.offset,
              type: selection.focus.type,
            },
            gridKey: selection.gridKey,
            type: "grid",
          }
        : null,
    };
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class LineBreakNode extends LexicalNode {
  static getType() {
    return "linebreak";
  }

  static clone(node) {
    return new LineBreakNode(node.__key);
  }

  constructor(key) {
    super(key);
  }

  getTextContent() {
    return "\n";
  }

  createDOM() {
    return document.createElement("br");
  }

  updateDOM() {
    return false;
  }

  static importDOM() {
    return {
      br: (node) => ({
        conversion: convertLineBreakElement,
        priority: 0,
      }),
    };
  }
}

function convertLineBreakElement(node) {
  return {
    node: $createLineBreakNode(),
  };
}

function $createLineBreakNode() {
  return new LineBreakNode();
}
function $isLineBreakNode(node) {
  return node instanceof LineBreakNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function simpleDiffWithCursor(a, b, cursor) {
  const aLength = a.length;
  const bLength = b.length;
  let left = 0; // number of same characters counting from left

  let right = 0; // number of same characters counting from right
  // Iterate left to the right until we find a changed character
  // First iteration considers the current cursor position

  while (
    left < aLength &&
    left < bLength &&
    a[left] === b[left] &&
    left < cursor
  ) {
    left++;
  } // Iterate right to the left until we find a changed character

  while (
    right + left < aLength &&
    right + left < bLength &&
    a[aLength - right - 1] === b[bLength - right - 1]
  ) {
    right++;
  } // Try to iterate left further to the right without caring about the current cursor position

  while (
    right + left < aLength &&
    right + left < bLength &&
    a[left] === b[left]
  ) {
    left++;
  }

  return {
    index: left,
    insert: b.slice(left, bLength - right),
    remove: aLength - left - right,
  };
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

function getElementOuterTag(node, format) {
  if (format & IS_CODE) {
    return "code";
  }

  if (format & IS_SUBSCRIPT) {
    return "sub";
  }

  if (format & IS_SUPERSCRIPT) {
    return "sup";
  }

  return null;
}

function getElementInnerTag(node, format) {
  if (format & IS_BOLD) {
    return "strong";
  }

  if (format & IS_ITALIC) {
    return "em";
  }

  return "span";
}

function setTextThemeClassNames(
  tag,
  prevFormat,
  nextFormat,
  dom,
  textClassNames
) {
  const domClassList = dom.classList; // Firstly we handle the base theme.

  let classNames = getCachedClassNameArray(textClassNames, "base");

  if (classNames !== undefined) {
    domClassList.add(...classNames);
  } // Secondly we handle the special case: underline + strikethrough.
  // We have to do this as we need a way to compose the fact that
  // the same CSS property will need to be used: text-decoration.
  // In an ideal world we shouldn't have to do this, but there's no
  // easy workaround for many atomic CSS systems today.

  classNames = getCachedClassNameArray(
    textClassNames,
    "underlineStrikethrough"
  );
  let hasUnderlineStrikethrough = false;
  const prevUnderlineStrikethrough =
    prevFormat & IS_UNDERLINE && prevFormat & IS_STRIKETHROUGH;
  const nextUnderlineStrikethrough =
    nextFormat & IS_UNDERLINE && nextFormat & IS_STRIKETHROUGH;

  if (classNames !== undefined) {
    if (nextUnderlineStrikethrough) {
      hasUnderlineStrikethrough = true;

      if (!prevUnderlineStrikethrough) {
        domClassList.add(...classNames);
      }
    } else if (prevUnderlineStrikethrough) {
      domClassList.remove(...classNames);
    }
  }

  for (const key in TEXT_TYPE_TO_FORMAT) {
    // $FlowFixMe: expected cast here
    const format = key;
    const flag = TEXT_TYPE_TO_FORMAT[format];
    classNames = getCachedClassNameArray(textClassNames, key);

    if (classNames !== undefined) {
      if (nextFormat & flag) {
        if (
          hasUnderlineStrikethrough &&
          (key === "underline" || key === "strikethrough")
        ) {
          if (prevFormat & flag) {
            domClassList.remove(...classNames);
          }

          continue;
        }

        if (
          (prevFormat & flag) === 0 ||
          (prevUnderlineStrikethrough && key === "underline") ||
          key === "strikethrough"
        ) {
          domClassList.add(...classNames);
        }
      } else if (prevFormat & flag) {
        domClassList.remove(...classNames);
      }
    }
  }
}

function diffComposedText(a, b) {
  const aLength = a.length;
  const bLength = b.length;
  let left = 0;
  let right = 0;

  while (left < aLength && left < bLength && a[left] === b[left]) {
    left++;
  }

  while (
    right + left < aLength &&
    right + left < bLength &&
    a[aLength - right - 1] === b[bLength - right - 1]
  ) {
    right++;
  }

  return [left, aLength - left - right, b.slice(left, bLength - right)];
}

function setTextContent(nextText, dom, node) {
  // $FlowFixMe: first node is always text
  const firstChild = dom.firstChild;
  const isComposing = node.isComposing(); // Always add a suffix if we're composing a node

  const suffix = isComposing ? ZERO_WIDTH_CHAR : "";
  const text = nextText + suffix;

  if (firstChild == null) {
    dom.textContent = text;
  } else {
    const nodeValue = firstChild.nodeValue;
    if (nodeValue !== text)
      if (isComposing) {
        const [index, remove, insert] = diffComposedText(nodeValue, text);

        if (remove !== 0) {
          firstChild.deleteData(index, remove);
        }

        firstChild.insertData(index, insert);
      } else {
        firstChild.nodeValue = text;
      }
  }
}

function createTextInnerDOM(innerDOM, node, innerTag, format, text, config) {
  setTextContent(text, innerDOM, node);
  const theme = config.theme; // Apply theme class names

  const textClassNames = theme.text;

  if (textClassNames !== undefined) {
    setTextThemeClassNames(innerTag, 0, format, innerDOM, textClassNames);
  }
}

function updateTextMarks(textNode, marks, offset, delCount, size) {
  for (let i = 0; i < marks.length; i++) {
    const { id, start, end } = marks[i];
    let newStart = start;
    let newEnd = end;

    if (newStart !== null && newStart >= offset) {
      if (offset + delCount >= newStart) {
        newStart = offset + delCount;
      }

      newStart += size - delCount;
    }

    if (newEnd !== null && newEnd >= offset) {
      if (offset + delCount >= newEnd) {
        newEnd = offset;
      }

      newEnd += size - delCount;
    }

    if (newStart !== start || newEnd !== end) {
      if (
        (newStart === null && newEnd === null) ||
        (newStart !== null && newEnd !== null && newStart >= newEnd)
      ) {
        textNode.deleteMark(id);
      } else {
        textNode.setMark(id, newStart, newEnd);
      }
    }
  }
}

class TextNode extends LexicalNode {
  static getType() {
    return "text";
  }

  static clone(node) {
    return new TextNode(node.__text, node.__key);
  }

  constructor(text, key) {
    super(key);
    this.__text = text;
    this.__format = 0;
    this.__style = "";
    this.__mode = 0;
    this.__detail = 0;
    this.__marks = null;
  }

  getFormat() {
    const self = this.getLatest();
    return self.__format;
  }

  getMark(id) {
    const self = this.getLatest();
    const marks = self.__marks;

    if (marks !== null) {
      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];

        if (mark.id === id) {
          return mark;
        }
      }
    }

    return null;
  }

  getStyle() {
    const self = this.getLatest();
    return self.__style;
  }

  isToken() {
    const self = this.getLatest();
    return self.__mode === IS_TOKEN;
  }

  isSegmented() {
    const self = this.getLatest();
    return self.__mode === IS_SEGMENTED;
  }

  isInert() {
    const self = this.getLatest();
    return self.__mode === IS_INERT;
  }

  isDirectionless() {
    const self = this.getLatest();
    return (self.__detail & IS_DIRECTIONLESS) !== 0;
  }

  isUnmergeable() {
    const self = this.getLatest();
    return (self.__detail & IS_UNMERGEABLE) !== 0;
  }

  hasFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT[type];
    return (this.getFormat() & formatFlag) !== 0;
  }

  isSimpleText() {
    return this.__type === "text" && this.__mode === 0;
  }

  getTextContent(includeInert, includeDirectionless) {
    if (
      (!includeInert && this.isInert()) ||
      (includeDirectionless === false && this.isDirectionless())
    ) {
      return "";
    }

    const self = this.getLatest();
    return self.__text;
  }

  getFormatFlags(type, alignWithFormat) {
    const self = this.getLatest();
    const format = self.__format;
    return toggleTextFormatType(format, type, alignWithFormat);
  } // View

  createDOM(config) {
    const format = this.__format;
    const outerTag = getElementOuterTag(this, format);
    const innerTag = getElementInnerTag(this, format);
    const tag = outerTag === null ? innerTag : outerTag;
    const dom = document.createElement(tag);
    let innerDOM = dom;

    if (outerTag !== null) {
      innerDOM = document.createElement(innerTag);
      dom.appendChild(innerDOM);
    }

    const text = this.__text;
    createTextInnerDOM(innerDOM, this, innerTag, format, text, config);
    const style = this.__style;

    if (style !== "") {
      dom.style.cssText = style;
    }

    return dom;
  }

  updateDOM(prevNode, dom, config) {
    const nextText = this.__text;
    const prevFormat = prevNode.__format;
    const nextFormat = this.__format;
    const prevOuterTag = getElementOuterTag(this, prevFormat);
    const nextOuterTag = getElementOuterTag(this, nextFormat);
    const prevInnerTag = getElementInnerTag(this, prevFormat);
    const nextInnerTag = getElementInnerTag(this, nextFormat);
    const prevTag = prevOuterTag === null ? prevInnerTag : prevOuterTag;
    const nextTag = nextOuterTag === null ? nextInnerTag : nextOuterTag;

    if (prevTag !== nextTag) {
      return true;
    }

    if (prevOuterTag === nextOuterTag && prevInnerTag !== nextInnerTag) {
      // $FlowFixMe: should always be an element
      const prevInnerDOM = dom.firstChild;

      if (prevInnerDOM == null) {
        {
          throw Error(`updateDOM: prevInnerDOM is null or undefined`);
        }
      }

      const nextInnerDOM = document.createElement(nextInnerTag);
      createTextInnerDOM(
        nextInnerDOM,
        this,
        nextInnerTag,
        nextFormat,
        nextText,
        config
      );
      dom.replaceChild(nextInnerDOM, prevInnerDOM);
      return false;
    }

    let innerDOM = dom;

    if (nextOuterTag !== null) {
      if (prevOuterTag !== null) {
        // $FlowFixMe: should always be an element
        innerDOM = dom.firstChild;

        if (innerDOM == null) {
          {
            throw Error(`updateDOM: innerDOM is null or undefined`);
          }
        }
      }
    }

    setTextContent(nextText, innerDOM, this);
    const theme = config.theme; // Apply theme class names

    const textClassNames = theme.text;

    if (textClassNames !== undefined && prevFormat !== nextFormat) {
      setTextThemeClassNames(
        nextInnerTag,
        prevFormat,
        nextFormat,
        innerDOM,
        textClassNames
      );
    }

    const prevStyle = prevNode.__style;
    const nextStyle = this.__style;

    if (prevStyle !== nextStyle) {
      dom.style.cssText = nextStyle;
    }

    return false;
  }

  static importDOM() {
    return {
      "#text": (node) => ({
        conversion: convertTextDOMNode,
        priority: 0,
      }),
      b: (node) => ({
        conversion: convertBringAttentionToElement,
        priority: 0,
      }),
      em: (node) => ({
        conversion: convertTextFormatElement,
        priority: 0,
      }),
      i: (node) => ({
        conversion: convertTextFormatElement,
        priority: 0,
      }),
      span: (node) => ({
        conversion: convertSpanElement,
        priority: 0,
      }),
      strong: (node) => ({
        conversion: convertTextFormatElement,
        priority: 0,
      }),
      u: (node) => ({
        conversion: convertTextFormatElement,
        priority: 0,
      }),
    };
  } // Mutators

  selectionTransform(prevSelection, nextSelection) {}

  setFormat(format) {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__format = format;
    return self;
  }

  setStyle(style) {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__style = style;
    return self;
  }

  toggleFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT[type];
    return this.setFormat(this.getFormat() ^ formatFlag);
  }

  toggleDirectionless() {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__detail ^= IS_DIRECTIONLESS;
    return self;
  }

  toggleUnmergeable() {
    errorOnReadOnly();
    const self = this.getWritable();
    self.__detail ^= IS_UNMERGEABLE;
    return self;
  }

  setMark(id, start, end) {
    errorOnReadOnly();
    const self = this.getWritable();
    let marks = self.__marks;
    let found = false;

    if (marks === null) {
      self.__marks = marks = [];
    }

    const nextMark = {
      end,
      id,
      start,
    };

    {
      Object.freeze(nextMark);
    }

    for (let i = 0; i < marks.length; i++) {
      const prevMark = marks[i];

      if (prevMark.id === id) {
        found = true;
        marks.splice(i, 1, nextMark);
        break;
      }
    }

    if (!found) {
      marks.push(nextMark);
    }
  }

  deleteMark(id) {
    errorOnReadOnly();
    const self = this.getWritable();
    const marks = self.__marks;

    if (marks === null) {
      return;
    }

    for (let i = 0; i < marks.length; i++) {
      const prevMark = marks[i];

      if (prevMark.id === id) {
        marks.splice(i, 1);
        break;
      }
    }

    if (marks.length === 0) {
      self.__marks = null;
    }
  }

  setMode(type) {
    errorOnReadOnly();
    const mode = TEXT_MODE_TO_TYPE[type];
    const self = this.getWritable();
    self.__mode = mode;
    return self;
  }

  setTextContent(text) {
    errorOnReadOnly();
    const writableSelf = this.getWritable();
    const marks = writableSelf.__marks;

    if (marks !== null) {
      const selection = $getSelection();
      let cursorOffset = text.length;

      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const anchor = selection.anchor;

        if (anchor.key === this.__key) {
          cursorOffset = anchor.offset;
        }
      }

      const diff = simpleDiffWithCursor(
        writableSelf.__text,
        text,
        cursorOffset
      );
      this.spliceText(diff.index, diff.remove, diff.insert);
    } else {
      writableSelf.__text = text;
    }

    return writableSelf;
  }

  select(_anchorOffset, _focusOffset) {
    errorOnReadOnly();
    let anchorOffset = _anchorOffset;
    let focusOffset = _focusOffset;
    const selection = $getSelection();
    const text = this.getTextContent();
    const key = this.__key;

    if (typeof text === "string") {
      const lastOffset = text.length;

      if (anchorOffset === undefined) {
        anchorOffset = lastOffset;
      }

      if (focusOffset === undefined) {
        focusOffset = lastOffset;
      }
    } else {
      anchorOffset = 0;
      focusOffset = 0;
    }

    if (!$isRangeSelection(selection)) {
      return internalMakeRangeSelection(
        key,
        anchorOffset,
        key,
        focusOffset,
        "text",
        "text"
      );
    } else {
      const compositionKey = $getCompositionKey();

      if (
        compositionKey === selection.anchor.key ||
        compositionKey === selection.focus.key
      ) {
        $setCompositionKey(key);
      }

      selection.setTextNodeRange(this, anchorOffset, this, focusOffset);
    }

    return selection;
  }

  spliceText(offset, delCount, newText, moveSelection) {
    errorOnReadOnly();
    const writableSelf = this.getWritable();
    const text = writableSelf.__text;
    const handledTextLength = newText.length;
    let index = offset;

    if (index < 0) {
      index = handledTextLength + index;

      if (index < 0) {
        index = 0;
      }
    }

    const selection = $getSelection();

    if (moveSelection && $isRangeSelection(selection)) {
      const newOffset = offset + handledTextLength;
      selection.setTextNodeRange(
        writableSelf,
        newOffset,
        writableSelf,
        newOffset
      );
    }

    const updatedText =
      text.slice(0, index) + newText + text.slice(index + delCount);
    const marks = writableSelf.__marks;

    if (marks !== null) {
      updateTextMarks(writableSelf, marks, offset, delCount, handledTextLength);
    }

    writableSelf.__text = updatedText;
    return writableSelf;
  }

  canInsertTextBefore() {
    return true;
  }

  canInsertTextAfter() {
    return true;
  }

  splitText(...splitOffsets) {
    errorOnReadOnly();
    const self = this.getLatest();
    const textContent = self.getTextContent();
    const key = self.__key;
    const compositionKey = $getCompositionKey();
    const offsetsSet = new Set(splitOffsets);
    const parts = [];
    const textLength = textContent.length;
    let string = "";

    for (let i = 0; i < textLength; i++) {
      if (string !== "" && offsetsSet.has(i)) {
        parts.push(string);
        string = "";
      }

      string += textContent[i];
    }

    if (string !== "") {
      parts.push(string);
    }

    const partsLength = parts.length;

    if (partsLength === 0) {
      return [];
    } else if (parts[0] === textContent) {
      return [self];
    }

    const firstPart = parts[0];
    const parent = self.getParentOrThrow();
    const parentKey = parent.__key;
    let writableNode;
    const format = self.getFormat();
    const style = self.getStyle();
    const detail = self.__detail;
    const marks = self.__marks;
    let hasReplacedSelf = false;

    if (self.isSegmented()) {
      // Create a new TextNode
      writableNode = $createTextNode(firstPart);
      writableNode.__parent = parentKey;
      writableNode.__format = format;
      writableNode.__style = style;
      writableNode.__detail = detail;
      writableNode.__marks = marks;
      hasReplacedSelf = true;
    } else {
      // For the first part, update the existing node
      writableNode = self.getWritable();
      writableNode.__text = firstPart;
    } // Handle selection

    const selection = $getSelection(); // Then handle all other parts

    const splitNodes = [writableNode];
    let textSize = firstPart.length;

    for (let i = 1; i < partsLength; i++) {
      const part = parts[i];
      const partSize = part.length;
      const sibling = $createTextNode(part).getWritable();
      sibling.__format = format;
      sibling.__style = style;
      sibling.__detail = detail;
      const siblingKey = sibling.__key;
      const nextTextSize = textSize + partSize;

      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;

        if (
          anchor.key === key &&
          anchor.type === "text" &&
          anchor.offset > textSize &&
          anchor.offset <= nextTextSize
        ) {
          anchor.key = siblingKey;
          anchor.offset -= textSize;
          selection.dirty = true;
        }

        if (
          focus.key === key &&
          focus.type === "text" &&
          focus.offset > textSize &&
          focus.offset <= nextTextSize
        ) {
          focus.key = siblingKey;
          focus.offset -= textSize;
          selection.dirty = true;
        }
      }

      if (compositionKey === key) {
        $setCompositionKey(siblingKey);
      }

      textSize = nextTextSize;
      sibling.__parent = parentKey;
      splitNodes.push(sibling);
    }

    if (marks !== null) {
      for (let i = 0; i < marks.length; i++) {
        const { id, start, end } = marks[i];
        let foundStart = false;
        let foundEnd = false;
        let partSize = 0;

        for (let s = 0; s < partsLength; s++) {
          const textNode = splitNodes[s];
          const nextPartSize = partSize + parts[s].length;
          const nextStart =
            !foundStart &&
            start !== null &&
            nextPartSize > start - (start === 0 ? 1 : 0)
              ? start - partSize
              : null;
          const nextEnd =
            !foundEnd && end !== null && nextPartSize >= end
              ? end - partSize
              : null;

          if (nextStart !== null || nextEnd !== null) {
            if (nextStart !== null) {
              foundStart = true;
            }

            if (nextEnd !== null) {
              foundEnd = true;
            }

            textNode.setMark(id, nextStart, nextEnd);

            if (foundStart && foundEnd) {
              break;
            }
          } else {
            textNode.deleteMark(id);
          }

          partSize = nextPartSize;
        }
      }
    } // Insert the nodes into the parent's children

    internalMarkSiblingsAsDirty(this);
    const writableParent = parent.getWritable();
    const writableParentChildren = writableParent.__children;
    const insertionIndex = writableParentChildren.indexOf(key);
    const splitNodesKeys = splitNodes.map((splitNode) => splitNode.__key);

    if (hasReplacedSelf) {
      writableParentChildren.splice(insertionIndex, 0, ...splitNodesKeys);
      this.remove();
    } else {
      writableParentChildren.splice(insertionIndex, 1, ...splitNodesKeys);
    }

    if ($isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(
        selection,
        parent,
        insertionIndex,
        partsLength - 1
      );
    }

    return splitNodes;
  }

  mergeWithSibling(target) {
    const isBefore = target === this.getPreviousSibling();

    if (!isBefore && target !== this.getNextSibling()) {
      {
        throw Error(
          `mergeWithSibling: sibling must be a previous or next sibling`
        );
      }
    }

    const key = this.__key;
    const targetKey = target.__key;
    const text = this.__text;
    const textLength = text.length;
    const compositionKey = $getCompositionKey();

    if (compositionKey === targetKey) {
      $setCompositionKey(key);
    }

    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;

      if (anchor !== null && anchor.key === targetKey) {
        adjustPointOffsetForMergedSibling(
          anchor,
          isBefore,
          key,
          target,
          textLength
        );
        selection.dirty = true;
      }

      if (focus !== null && focus.key === targetKey) {
        adjustPointOffsetForMergedSibling(
          focus,
          isBefore,
          key,
          target,
          textLength
        );
        selection.dirty = true;
      }
    }

    const targetText = target.__text;
    const targetTextLength = targetText.length;
    const newText = isBefore ? targetText + text : text + targetText;
    this.setTextContent(newText);
    const writableSelf = this.getWritable();

    const marks = target.getLatest().__marks;

    if (marks !== null) {
      updateTextMarks(
        writableSelf,
        marks,
        isBefore ? targetTextLength : 0,
        0,
        textLength
      );
    }

    target.remove();
    return writableSelf;
  }

  isTextEntity() {
    return false;
  }
}

function convertSpanElement(domNode) {
  // $FlowFixMe[incompatible-type] domNode is a <span> since we matched it by nodeName
  const span = domNode; // Google Docs uses span tags + font-weight for bold text

  const hasBoldFontWeight = span.style.fontWeight === "700";
  return {
    forChild: (lexicalNode) => {
      if ($isTextNode(lexicalNode) && hasBoldFontWeight) {
        lexicalNode.toggleFormat("bold");
      }

      return lexicalNode;
    },
    node: null,
  };
}

function convertBringAttentionToElement(domNode) {
  // $FlowFixMe[incompatible-type] domNode is a <b> since we matched it by nodeName
  const b = domNode; // Google Docs wraps all copied HTML in a <b> with font-weight normal

  const hasNormalFontWeight = b.style.fontWeight === "normal";
  return {
    forChild: (lexicalNode) => {
      if ($isTextNode(lexicalNode) && !hasNormalFontWeight) {
        lexicalNode.toggleFormat("bold");
      }

      return lexicalNode;
    },
    node: null,
  };
}

function convertTextDOMNode(domNode) {
  return {
    node: $createTextNode(domNode.textContent),
  };
}

const nodeNameToTextFormat = {
  em: "italic",
  i: "italic",
  strong: "bold",
  u: "underline",
};

function convertTextFormatElement(domNode) {
  const format = nodeNameToTextFormat[domNode.nodeName.toLowerCase()];

  if (format === undefined) {
    return {
      node: null,
    };
  }

  return {
    forChild: (lexicalNode) => {
      if ($isTextNode(lexicalNode)) {
        lexicalNode.toggleFormat(format);
      }

      return lexicalNode;
    },
    node: null,
  };
}

function $createTextNode(text = "") {
  return new TextNode(text);
}
function $isTextNode(node) {
  return node instanceof TextNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class ParagraphNode extends ElementNode {
  static getType() {
    return "paragraph";
  }

  static clone(node) {
    return new ParagraphNode(node.__key);
  } // View

  createDOM(config) {
    const dom = document.createElement("p");
    const classNames = getCachedClassNameArray(config.theme, "paragraph");

    if (classNames !== undefined) {
      const domClassList = dom.classList;
      domClassList.add(...classNames);
    }

    return dom;
  }

  updateDOM(prevNode, dom) {
    return false;
  }

  static importDOM() {
    return {
      p: (node) => ({
        conversion: convertParagraphElement,
        priority: 0,
      }),
    };
  }

  exportDOM(editor) {
    const { element } = super.exportDOM(editor);

    if (element) {
      if (this.getTextContentSize() === 0) {
        element.append(document.createElement("br"));
      }
    }

    return {
      element,
    };
  } // Mutation

  insertNewAfter() {
    const newElement = $createParagraphNode();
    const direction = this.getDirection();
    newElement.setDirection(direction);
    this.insertAfter(newElement);
    return newElement;
  }

  collapseAtStart() {
    const children = this.getChildren(); // If we have an empty (trimmed) first paragraph and try and remove it,
    // delete the paragraph as long as we have another sibling to go to

    if (
      children.length === 0 ||
      ($isTextNode(children[0]) && children[0].getTextContent().trim() === "")
    ) {
      const nextSibling = this.getNextSibling();

      if (nextSibling !== null) {
        this.selectNext();
        this.remove();
        return true;
      }

      const prevSibling = this.getPreviousSibling();

      if (prevSibling !== null) {
        this.selectPrevious();
        this.remove();
        return true;
      }
    }

    return false;
  }
}

function convertParagraphElement() {
  return {
    node: $createParagraphNode(),
  };
}

function $createParagraphNode() {
  return new ParagraphNode();
}
function $isParagraphNode(node) {
  return node instanceof ParagraphNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const COMMAND_PRIORITY_EDITOR = 0;
const COMMAND_PRIORITY_LOW = 1;
const COMMAND_PRIORITY_NORMAL = 2;
const COMMAND_PRIORITY_HIGH = 3;
const COMMAND_PRIORITY_CRITICAL = 4; // eslint-disable-next-line no-unused-vars

function resetEditor(
  editor,
  prevRootElement,
  nextRootElement,
  pendingEditorState
) {
  const keyNodeMap = editor._keyToDOMMap;
  keyNodeMap.clear();
  editor._editorState = createEmptyEditorState();
  editor._pendingEditorState = pendingEditorState;
  editor._compositionKey = null;
  editor._dirtyType = NO_DIRTY_NODES;

  editor._cloneNotNeeded.clear();

  editor._dirtyLeaves = new Set();

  editor._dirtyElements.clear();

  editor._normalizedNodes = new Set();
  editor._updateTags = new Set();
  editor._updates = [];
  const observer = editor._observer;

  if (observer !== null) {
    observer.disconnect();
    editor._observer = null;
  } // Remove all the DOM nodes from the root element

  if (prevRootElement !== null) {
    prevRootElement.textContent = "";
  }

  if (nextRootElement !== null) {
    nextRootElement.textContent = "";
    keyNodeMap.set("root", nextRootElement);
  }
}

function initializeConversionCache(nodes) {
  const conversionCache = new Map();
  const handledConversions = new Set();
  nodes.forEach((node) => {
    const importDOM = node.klass.importDOM;

    if (handledConversions.has(importDOM)) {
      return;
    }

    handledConversions.add(importDOM);
    const map = importDOM();

    if (map !== null) {
      Object.keys(map).forEach((key) => {
        let currentCache = conversionCache.get(key);

        if (currentCache === undefined) {
          currentCache = [];
          conversionCache.set(key, currentCache);
        }

        currentCache.push(map[key]);
      });
    }
  });
  return conversionCache;
}

function createEditor(editorConfig) {
  const config = editorConfig || {};
  const namespace = config.namespace || createUID();
  const theme = config.theme || {};
  const parentEditor = config.parentEditor || null;
  const disableEvents = config.disableEvents || false;
  const editorState = createEmptyEditorState();
  const initialEditorState = config.editorState;
  const nodes = [
    RootNode,
    TextNode,
    LineBreakNode,
    ParagraphNode,
    ...(config.nodes || []),
  ];
  const onError = config.onError;
  const isReadOnly = config.readOnly || false;
  const registeredNodes = new Map();

  for (let i = 0; i < nodes.length; i++) {
    const klass = nodes[i];
    const type = klass.getType();
    registeredNodes.set(type, {
      klass,
      transforms: new Set(),
    });
  } // klass: Array<Class<LexicalNode>>
  // $FlowFixMe: use our declared type instead

  const editor = new LexicalEditor(
    editorState,
    parentEditor,
    registeredNodes,
    {
      disableEvents,
      namespace,
      theme,
    },
    onError,
    initializeConversionCache(registeredNodes),
    isReadOnly
  );

  if (initialEditorState !== undefined) {
    editor._pendingEditorState = initialEditorState;
    editor._dirtyType = FULL_RECONCILE;
  }

  return editor;
}
class LexicalEditor {
  constructor(
    editorState,
    parentEditor,
    nodes,
    config,
    onError,
    htmlConversions,
    readOnly
  ) {
    this._parentEditor = parentEditor; // The root element associated with this editor

    this._rootElement = null; // The current editor state

    this._editorState = editorState; // Handling of drafts and updates

    this._pendingEditorState = null; // Used to help co-ordinate selection and events

    this._compositionKey = null;
    this._deferred = []; // Used during reconciliation

    this._keyToDOMMap = new Map();
    this._updates = [];
    this._updating = false; // Listeners

    this._listeners = {
      decorator: new Set(),
      mutation: new Map(),
      readonly: new Set(),
      root: new Set(),
      textcontent: new Set(),
      update: new Set(),
    }; // Commands

    this._commands = new Map(); // Editor configuration for theme/context.

    this._config = config; // Mapping of types to their nodes

    this._nodes = nodes; // React node decorators for portals

    this._decorators = {};
    this._pendingDecorators = null; // Used to optimize reconcilation

    this._dirtyType = NO_DIRTY_NODES;
    this._cloneNotNeeded = new Set();
    this._dirtyLeaves = new Set();
    this._dirtyElements = new Map();
    this._normalizedNodes = new Set();
    this._updateTags = new Set(); // Handling of DOM mutations

    this._observer = null; // Used for identifying owning editors

    this._key = generateRandomKey();
    this._onError = onError;
    this._htmlConversions = htmlConversions;
    this._readOnly = false;
  }

  isComposing() {
    return this._compositionKey != null;
  }

  registerUpdateListener(listener) {
    const listenerSetOrMap = this._listeners.update;
    listenerSetOrMap.add(listener);
    return () => {
      listenerSetOrMap.delete(listener);
    };
  }

  registerReadOnlyListener(listener) {
    const listenerSetOrMap = this._listeners.readonly;
    listenerSetOrMap.add(listener);
    return () => {
      listenerSetOrMap.delete(listener);
    };
  }

  registerDecoratorListener(listener) {
    const listenerSetOrMap = this._listeners.decorator;
    listenerSetOrMap.add(listener);
    return () => {
      listenerSetOrMap.delete(listener);
    };
  }

  registerTextContentListener(listener) {
    const listenerSetOrMap = this._listeners.textcontent;
    listenerSetOrMap.add(listener);
    return () => {
      listenerSetOrMap.delete(listener);
    };
  }

  registerRootListener(listener) {
    const listenerSetOrMap = this._listeners.root;
    listener(this._rootElement, null);
    listenerSetOrMap.add(listener);
    return () => {
      listener(null, this._rootElement);
      listenerSetOrMap.delete(listener);
    };
  }

  registerCommand(command, listener, priority) {
    if (priority === undefined) {
      {
        throw Error(`Listener for type "command" requires a "priority".`);
      }
    }

    const commandsMap = this._commands;

    if (!commandsMap.has(command)) {
      commandsMap.set(command, [
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
      ]);
    }

    const listenersInPriorityOrder = commandsMap.get(command);

    if (listenersInPriorityOrder === undefined) {
      {
        throw Error(
          `registerCommand: Command ${command} not found in command map`
        );
      }
    }

    const listeners = listenersInPriorityOrder[priority];
    listeners.add(listener);
    return () => {
      listeners.delete(listener);

      if (
        listenersInPriorityOrder.every(
          (listenersSet) => listenersSet.size === 0
        )
      ) {
        commandsMap.delete(command);
      }
    };
  }

  registerMutationListener(klass, listener) {
    const registeredNode = this._nodes.get(klass.getType());

    if (registeredNode === undefined) {
      {
        throw Error(
          `Node ${klass.name} has not been registered. Ensure node has been passed to createEditor.`
        );
      }
    }

    const mutations = this._listeners.mutation;
    mutations.set(listener, klass);
    return () => {
      mutations.delete(listener);
    };
  }

  registerNodeTransform( // There's no Flow-safe way to preserve the T in Transform<T>, but <T: LexicalNode> in the
    // declaration below guarantees these are LexicalNodes.
    klass,
    listener
  ) {
    const type = klass.getType();

    const registeredNode = this._nodes.get(type);

    if (registeredNode === undefined) {
      {
        throw Error(
          `Node ${klass.name} has not been registered. Ensure node has been passed to createEditor.`
        );
      }
    }

    const transforms = registeredNode.transforms;
    transforms.add(listener);
    markAllNodesAsDirty(this, type);
    return () => {
      transforms.delete(listener);
    };
  }

  hasNodes(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const klass = nodes[i];
      const type = klass.getType();

      if (!this._nodes.has(type)) {
        return false;
      }
    }

    return true;
  }

  dispatchCommand(type, payload) {
    return dispatchCommand(this, type, payload);
  }

  getDecorators() {
    return this._decorators;
  }

  getRootElement() {
    return this._rootElement;
  }

  getKey() {
    return this._key;
  }

  setRootElement(nextRootElement) {
    const prevRootElement = this._rootElement;

    if (nextRootElement !== prevRootElement) {
      const pendingEditorState = this._pendingEditorState || this._editorState;
      this._rootElement = nextRootElement;
      resetEditor(this, prevRootElement, nextRootElement, pendingEditorState);

      if (prevRootElement !== null) {
        // TODO: remove this flag once we no longer use UEv2 internally
        if (!this._config.disableEvents) {
          removeRootElementEvents(prevRootElement);
        }
      }

      if (nextRootElement !== null) {
        const style = nextRootElement.style;
        style.userSelect = "text";
        style.whiteSpace = "pre-wrap";
        style.wordBreak = "break-word";
        nextRootElement.setAttribute("data-lexical-editor", "true");
        this._dirtyType = FULL_RECONCILE;
        initMutationObserver(this);

        this._updateTags.add("history-merge");

        commitPendingUpdates(this); // TODO: remove this flag once we no longer use UEv2 internally

        if (!this._config.disableEvents) {
          addRootElementEvents(nextRootElement, this);
        }
      }

      triggerListeners("root", this, false, nextRootElement, prevRootElement);
    }
  }

  getElementByKey(key) {
    return this._keyToDOMMap.get(key) || null;
  }

  getEditorState() {
    return this._editorState;
  }

  setEditorState(editorState, options) {
    if (editorState.isEmpty()) {
      {
        throw Error(
          `setEditorState: the editor state is empty. Ensure the editor state's root node never becomes empty.`
        );
      }
    }

    flushRootMutations(this);
    const pendingEditorState = this._pendingEditorState;
    const tags = this._updateTags;
    const tag = options !== undefined ? options.tag : null;

    if (pendingEditorState !== null && !pendingEditorState.isEmpty()) {
      if (tag != null) {
        tags.add(tag);
      }

      commitPendingUpdates(this);
    }

    this._pendingEditorState = editorState;
    this._dirtyType = FULL_RECONCILE;
    this._compositionKey = null;

    if (tag != null) {
      tags.add(tag);
    }

    commitPendingUpdates(this);
  }

  parseEditorState(stringifiedEditorState) {
    const parsedEditorState = JSON.parse(stringifiedEditorState);
    return parseEditorState(parsedEditorState, this);
  }

  update(updateFn, options) {
    updateEditor(this, updateFn, options);
  }

  focus(callbackFn) {
    const rootElement = this._rootElement;

    if (rootElement !== null) {
      // This ensures that iOS does not trigger caps lock upon focus
      rootElement.setAttribute("autocapitalize", "off");
      updateEditor(
        this,
        () => {
          const selection = $getSelection();
          const root = $getRoot();

          if (selection !== null) {
            // Marking the selection dirty will force the selection back to it
            selection.dirty = true;
          } else if (root.getChildrenSize() !== 0) {
            root.selectEnd();
          }
        },
        {
          onUpdate: () => {
            rootElement.removeAttribute("autocapitalize");

            if (callbackFn) {
              callbackFn();
            }
          },
        }
      );
    }
  }

  blur() {
    const rootElement = this._rootElement;

    if (rootElement !== null) {
      rootElement.blur();
    }

    const domSelection = getDOMSelection();

    if (domSelection !== null) {
      domSelection.removeAllRanges();
    }
  }

  isReadOnly() {
    return this._readOnly;
  }

  setReadOnly(readOnly) {
    this._readOnly = readOnly;
    triggerListeners("readonly", this, true, readOnly);
  }

  toJSON() {
    return {
      editorState: this._editorState,
    };
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const VERSION = "0.2.5";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class GridCellNode extends ElementNode {
  constructor(colSpan, key) {
    super(key);
  }
}
function $isGridCellNode(node) {
  return node instanceof GridCellNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class GridNode extends ElementNode {}
function $isGridNode(node) {
  return node instanceof GridNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class GridRowNode extends ElementNode {}
function $isGridRowNode(node) {
  return node instanceof GridRowNode;
}

exports.$createGridSelection = $createEmptyGridSelection;
exports.$createLineBreakNode = $createLineBreakNode;
exports.$createNodeFromParse = $createNodeFromParse;
exports.$createNodeSelection = $createEmptyObjectSelection;
exports.$createParagraphNode = $createParagraphNode;
exports.$createRangeSelection = $createEmptyRangeSelection;
exports.$createTextNode = $createTextNode;
exports.$getDecoratorNode = $getDecoratorNode;
exports.$getNearestNodeFromDOMNode = $getNearestNodeFromDOMNode;
exports.$getNodeByKey = $getNodeByKey;
exports.$getPreviousSelection = $getPreviousSelection;
exports.$getRoot = $getRoot;
exports.$getSelection = $getSelection;
exports.$isDecoratorNode = $isDecoratorNode;
exports.$isElementNode = $isElementNode;
exports.$isGridCellNode = $isGridCellNode;
exports.$isGridNode = $isGridNode;
exports.$isGridRowNode = $isGridRowNode;
exports.$isGridSelection = $isGridSelection;
exports.$isLeafNode = $isLeafNode;
exports.$isLineBreakNode = $isLineBreakNode;
exports.$isNodeSelection = $isNodeSelection;
exports.$isParagraphNode = $isParagraphNode;
exports.$isRangeSelection = $isRangeSelection;
exports.$isRootNode = $isRootNode;
exports.$isTextNode = $isTextNode;
exports.$nodesOfType = $nodesOfType;
exports.$setCompositionKey = $setCompositionKey;
exports.$setSelection = $setSelection;
exports.BLUR_COMMAND = BLUR_COMMAND;
exports.CAN_REDO_COMMAND = CAN_REDO_COMMAND;
exports.CAN_UNDO_COMMAND = CAN_UNDO_COMMAND;
exports.CLEAR_EDITOR_COMMAND = CLEAR_EDITOR_COMMAND;
exports.CLEAR_HISTORY_COMMAND = CLEAR_HISTORY_COMMAND;
exports.CLICK_COMMAND = CLICK_COMMAND;
exports.COMMAND_PRIORITY_CRITICAL = COMMAND_PRIORITY_CRITICAL;
exports.COMMAND_PRIORITY_EDITOR = COMMAND_PRIORITY_EDITOR;
exports.COMMAND_PRIORITY_HIGH = COMMAND_PRIORITY_HIGH;
exports.COMMAND_PRIORITY_LOW = COMMAND_PRIORITY_LOW;
exports.COMMAND_PRIORITY_NORMAL = COMMAND_PRIORITY_NORMAL;
exports.COPY_COMMAND = COPY_COMMAND;
exports.CUT_COMMAND = CUT_COMMAND;
exports.DELETE_CHARACTER_COMMAND = DELETE_CHARACTER_COMMAND;
exports.DELETE_LINE_COMMAND = DELETE_LINE_COMMAND;
exports.DELETE_WORD_COMMAND = DELETE_WORD_COMMAND;
exports.DRAGEND_COMMAND = DRAGEND_COMMAND;
exports.DRAGSTART_COMMAND = DRAGSTART_COMMAND;
exports.DROP_COMMAND = DROP_COMMAND;
exports.DecoratorNode = DecoratorNode;
exports.ElementNode = ElementNode;
exports.FOCUS_COMMAND = FOCUS_COMMAND;
exports.FORMAT_ELEMENT_COMMAND = FORMAT_ELEMENT_COMMAND;
exports.FORMAT_TEXT_COMMAND = FORMAT_TEXT_COMMAND;
exports.GridCellNode = GridCellNode;
exports.GridNode = GridNode;
exports.GridRowNode = GridRowNode;
exports.INDENT_CONTENT_COMMAND = INDENT_CONTENT_COMMAND;
exports.INSERT_LINE_BREAK_COMMAND = INSERT_LINE_BREAK_COMMAND;
exports.INSERT_PARAGRAPH_COMMAND = INSERT_PARAGRAPH_COMMAND;
exports.INSERT_TEXT_COMMAND = INSERT_TEXT_COMMAND;
exports.KEY_ARROW_DOWN_COMMAND = KEY_ARROW_DOWN_COMMAND;
exports.KEY_ARROW_LEFT_COMMAND = KEY_ARROW_LEFT_COMMAND;
exports.KEY_ARROW_RIGHT_COMMAND = KEY_ARROW_RIGHT_COMMAND;
exports.KEY_ARROW_UP_COMMAND = KEY_ARROW_UP_COMMAND;
exports.KEY_BACKSPACE_COMMAND = KEY_BACKSPACE_COMMAND;
exports.KEY_DELETE_COMMAND = KEY_DELETE_COMMAND;
exports.KEY_ENTER_COMMAND = KEY_ENTER_COMMAND;
exports.KEY_ESCAPE_COMMAND = KEY_ESCAPE_COMMAND;
exports.KEY_MODIFIER_COMMAND = KEY_MODIFIER_COMMAND;
exports.KEY_TAB_COMMAND = KEY_TAB_COMMAND;
exports.OUTDENT_CONTENT_COMMAND = OUTDENT_CONTENT_COMMAND;
exports.PASTE_COMMAND = PASTE_COMMAND;
exports.ParagraphNode = ParagraphNode;
exports.REDO_COMMAND = REDO_COMMAND;
exports.REMOVE_TEXT_COMMAND = REMOVE_TEXT_COMMAND;
exports.SELECTION_CHANGE_COMMAND = SELECTION_CHANGE_COMMAND;
exports.TextNode = TextNode;
exports.UNDO_COMMAND = UNDO_COMMAND;
exports.VERSION = VERSION;
exports.createCommand = createCommand;
exports.createEditor = createEditor;
