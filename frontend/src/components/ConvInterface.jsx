import { SendHorizontal } from "lucide-react";
import { Image } from "lucide-react";
import { SmilePlus } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Loader2 } from "lucide-react";

import { motion } from "framer-motion";
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";

import { ImageSenderInterface } from "./imageSenderInterface";

import PropTypes from "prop-types";

import { ConvContext } from "../contexts/ConvContext";

ConvInterface.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }),
};

export function ConvInterface(props) {
  const { recipient, messages, status, setStatus, convId } =
    useContext(ConvContext);

  const fileInputRef = useRef(null);
  const [picToSendSelected, setPicToSendSelected] = useState(false);
  const [picUrl, setPicUrl] = useState(null);
  const [pic, setPic] = useState(null);

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    const maxSize = 1 * 1024 * 1024;

    if (!file || file.size > maxSize) {
      console.log("file is too large.");
      return;
    }

    const url = URL.createObjectURL(file);

    setPic(file);
    setPicUrl(url);
    setPicToSendSelected(true);
  };

  const [loading, setLoading] = useState(false);

  async function sendMessageImage() {
    try {
      setLoading(true);
      let conversationId = convId;

      if (status !== "exist") {
        const newConversationResponse = await axios.post(
          `http://localhost:3000/user/${props.user._id}/conversations`,
          {
            recipient: recipient._id,
            lastMessage: inputValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        conversationId = newConversationResponse.data._id;

        updateLocalStorageWithNewConversation(newConversationResponse.data);
        setStatus("exist");
      }

      const messageResponse = await sendImageToConversation(
        conversationId,
        pic,
        props,
      );

      updateUIAndLocalStorageWithNewMessage(
        conversationId,
        messageResponse.data.message,
        messages,
      );

      setPicToSendSelected(false);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }
  //need to prettier
  //and eventually will clear out lengthy images to speed up load speed
  //before hosting it as my portfolio project

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  async function sendMessageText() {
    try {
      setLoading(true);

      let conversationId = convId;

      if (status !== "exist") {
        const newConversationResponse = await axios.post(
          `http://localhost:3000/user/${props.user._id}/conversations`,
          {
            recipient: recipient._id,
            lastMessage: inputValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        conversationId = newConversationResponse.data._id;

        updateLocalStorageWithNewConversation(newConversationResponse.data);
        setStatus("exist");
      }

      const messageResponse = await sendMessageToConversation(
        conversationId,
        inputValue,
        props,
      );

      updateUIAndLocalStorageWithNewMessage(
        conversationId,
        messageResponse.data.message,
        messages,
      );

      setInputValue("");

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <section className="w-[70%] h-full">
        <div className="w-full h-[9%] flex gap-3 items-center border-x border-gray-300">
          {recipient.profilePic ? (
            <div className="ml-5 mr-[.315rem] w-[3.2rem] h-[3.2rem] rounded-full overflow-hidden flex-shrink-0">
              <img
                src={recipient.profilePic}
                alt={`${recipient.username}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="ml-5 w-14 h-14 default-pic flex-shrink-0"></div>
          )}
          <div className="flex flex-col mb-1  overflow-hidden max-w-[23vw]">
            <h1 className="text-lg truncate font-semibold">
              {recipient.username}
            </h1>
            <h2 className="text-xs truncate">{recipient.description}</h2>
          </div>
          <MoreVertical
            className={`relative ${!picToSendSelected ? "left-[58vw]" : "left-[27.5vw]"}`}
          />
        </div>

        <div className="w-full h-[81%] flex flex-col gap-5 user-input-bg border border-b-0 py-3 px-16 border-gray-300 overflow-y-scroll">
          {messages.map((message, index) => {
            const isReceived = message.sender === recipient._id;

            let messageContent;
            if (message.content.type === "text") {
              messageContent = <div>{message.content.text}</div>;
            } else if (message.content.type === "image") {
              const uintArray = new Uint8Array(
                message.content.image.image.data.data,
              );
              const blob = new Blob([uintArray], { type: "image/jpeg" });
              const picUrl = URL.createObjectURL(blob);

              messageContent = (
                <div>
                  <img
                    className="rounded-lg w-[12vw] h-[35vh] object-cover"
                    src={picUrl}
                    alt=""
                  />
                </div>
              );
            } else {
              messageContent = <div>Unsupported content type</div>;
            }

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                key={index}
                className={`message ${isReceived ? "received" : ""}`}
              >
                {messageContent}
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="w-full h-[10%] flex items-center gap-4 border border-l-0 border-gray-300">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
          <motion.button
            variants={buttonVariants}
            onClick={handleProfilePicClick}
            whileHover="hover"
            whileTap="rest"
            initial="rest"
            className="ml-4 rounded-full"
          >
            <Image />
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="rest"
            initial="rest"
            className="rounded-full"
          >
            <SmilePlus />
          </motion.button>
          <input
            value={inputValue}
            onChange={handleInputChange}
            className="w-[80%] h-[5.5vh] text-bar rounded-lg px-4"
            type="text"
            placeholder="Type a Message..."
          />
          {!loading ? (
            <motion.button
              onClick={sendMessageText}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="rest"
              initial="rest"
              className={`rounded-full ${picToSendSelected ? "mx-3" : "none"}`}
            >
              <SendHorizontal />
            </motion.button>
          ) : (
            <button disabled className="rounded-full">
              <Loader2 className="animate-spin" />
            </button>
          )}
        </div>
      </section>
      {picToSendSelected && (
        <ImageSenderInterface
          loading={loading}
          picUrl={picUrl}
          setPicToSendSelected={setPicToSendSelected}
          sendMessageImage={sendMessageImage}
        />
      )}
    </>
  );
}

async function sendImageToConversation(conversationId, image, props) {
  const formData = new FormData();
  formData.append("image", image);

  const token = localStorage.getItem("token");

  return await axios.post(
    `http://localhost:3000/user/${props.user._id}/conversations/${conversationId}/message/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

async function sendMessageToConversation(conversationId, content, props) {
  return await axios.post(
    `http://localhost:3000/user/${props.user._id}/conversations/${conversationId}/message/text`,
    {
      content: content,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
}

function updateLocalStorageWithNewConversation(newConversation) {
  let conversations = JSON.parse(localStorage.getItem("conversations")) || [];

  //profile pic only shows after log back in (to avoid blob urls going bye bye)
  conversations.push(newConversation);
  localStorage.setItem("conversations", JSON.stringify(conversations));
}

function updateUIAndLocalStorageWithNewMessage(
  conversationId,
  newMessage,
  messages,
) {
  let conversations = JSON.parse(localStorage.getItem("conversations")) || [];
  const index = conversations.findIndex((conv) => conv._id === conversationId);

  if (index !== -1) {
    const profilePic = conversations[index].users[0].profilePic;
    conversations[index].lastMessage = newMessage.content.text || "image";
    conversations[index].messages.push(newMessage);

    if (profilePic) {
      conversations[index].users[0].profilePic = profilePic;
    }
    localStorage.setItem("conversations", JSON.stringify(conversations));
    messages.push(newMessage);
  }
}
