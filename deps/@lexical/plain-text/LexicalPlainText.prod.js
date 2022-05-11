/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var a=require("@lexical/clipboard"),g=require("@lexical/selection"),k=require("@lexical/utils"),l=require("lexical");const m="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement,n=m&&"documentMode"in document?document.documentMode:null;m&&/Mac|iPod|iPhone|iPad/.test(navigator.platform);m&&/^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
const p=m&&"InputEvent"in window&&!n?"getTargetRanges"in new window.InputEvent("input"):!1,q=m&&/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),r=m&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,t={tag:"history-merge"};function u(d,e){d.preventDefault();e.update(()=>{const f=d.clipboardData,b=l.$getSelection();if(null!==b&&null!=f){const c=a.getHtmlContent(e);null!==c&&f.setData("text/html",c);f.setData("text/plain",b.getTextContent())}})}
function v(d,e){d.preventDefault();e.update(()=>{const f=l.$getSelection(),b=d.clipboardData;null!=b&&l.$isRangeSelection(f)&&a.$insertDataTransferForPlainText(b,f)})}function w(d,e){u(d,e);e.update(()=>{const f=l.$getSelection();l.$isRangeSelection(f)&&f.removeText()})}
function x(d,e){if(null!==e)if(void 0===e)d.update(()=>{var f=l.$getRoot();if(null===f.getFirstChild()){const b=l.$createParagraphNode();f.append(b);f=document.activeElement;(null!==l.$getSelection()||null!==f&&f===d.getRootElement())&&b.select()}},t);else if(null!==e)switch(typeof e){case "string":e=d.parseEditorState(e);d.setEditorState(e,t);break;case "object":d.setEditorState(e,t);break;case "function":d.update(e,t)}}
exports.registerPlainText=function(d,e){const f=k.mergeRegister(d.registerCommand(l.DELETE_CHARACTER_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;c.deleteCharacter(b);return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.DELETE_WORD_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;c.deleteWord(b);return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.DELETE_LINE_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;c.deleteLine(b);
return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.INSERT_TEXT_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;if("string"===typeof b)c.insertText(b);else{const h=b.dataTransfer;null!=h?a.$insertDataTransferForPlainText(h,c):(b=b.data)&&c.insertText(b)}return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.REMOVE_TEXT_COMMAND,()=>{const b=l.$getSelection();if(!l.$isRangeSelection(b))return!1;b.removeText();return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.INSERT_LINE_BREAK_COMMAND,
b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;c.insertLineBreak(b);return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.INSERT_PARAGRAPH_COMMAND,()=>{const b=l.$getSelection();if(!l.$isRangeSelection(b))return!1;b.insertLineBreak();return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.KEY_ARROW_LEFT_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;const h=b.shiftKey;return g.$shouldOverrideDefaultCharacterSelection(c,!0)?(b.preventDefault(),g.$moveCharacter(c,
h,!0),!0):!1},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.KEY_ARROW_RIGHT_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;const h=b.shiftKey;return g.$shouldOverrideDefaultCharacterSelection(c,!1)?(b.preventDefault(),g.$moveCharacter(c,h,!1),!0):!1},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.KEY_BACKSPACE_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;b.preventDefault();return d.dispatchCommand(l.DELETE_CHARACTER_COMMAND,!0)},l.COMMAND_PRIORITY_EDITOR),
d.registerCommand(l.KEY_DELETE_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;b.preventDefault();return d.dispatchCommand(l.DELETE_CHARACTER_COMMAND,!1)},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.KEY_ENTER_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;if(null!==b){if((r||q)&&p)return!1;b.preventDefault()}return d.dispatchCommand(l.INSERT_LINE_BREAK_COMMAND)},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.COPY_COMMAND,b=>{const c=l.$getSelection();
if(!l.$isRangeSelection(c))return!1;u(b,d);return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.CUT_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;w(b,d);return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.PASTE_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;v(b,d);return!0},l.COMMAND_PRIORITY_EDITOR),d.registerCommand(l.DROP_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;b.preventDefault();return!0},l.COMMAND_PRIORITY_EDITOR),
d.registerCommand(l.DRAGSTART_COMMAND,b=>{const c=l.$getSelection();if(!l.$isRangeSelection(c))return!1;b.preventDefault();return!0},l.COMMAND_PRIORITY_EDITOR));x(d,e);return f};