"use client";

import { FC, useEffect, useState } from "react";
import { useApiRequest } from "hooks/useApiRequest";

interface APIResponse {
  id: number;
  response: string;
}

interface Message {
  id: number;
  role: string;
  message: string;
}

interface RequestBody {
  question: string;
}

const Chat: FC = () => {
  const [fetchAnswer, { data, loading, error }] = useApiRequest<
    APIResponse,
    RequestBody
  >(`/api`, `POST`);

  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  useEffect(() => {
    if (
      messageHistory.length > 0 &&
      messageHistory[messageHistory.length - 1].role === "user"
    ) {
      void fetchAnswer({
        question: messageHistory[messageHistory.length - 1].message,
      });
    }
  }, [messageHistory]);

  const handleUserKeyPress = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    const input = document.getElementById("chat-input") as HTMLInputElement;
    const text = input.value;
    if (text.length > 0) {
      let message: Message = {
        id: messageHistory.length + 1,
        role: "user",
        message: text,
      };
      setMessageHistory([...messageHistory, message]);
      input.value = "";
      input.focus();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  });

  if (error) {
    return <p className="text-white">Error: {error}</p>;
  }

  if (data) {
    let message: Message = {
      id: data.id,
      role: "bot",
      message: data.response,
    };
    if (!messageHistory.find((item) => item.id === data.id)) {
      setMessageHistory([...messageHistory, message]);
    }
  }

  return (
    <div className="h-[100vh]">
      <div className="p-5">
        <h1 className="text-center text-zinc-200 font-bold text-lg">PostgresML Powered Chat</h1>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-7xl pr-[10%] pl-[10%]">
          <div className="text-zinc-100 rounded-md">
            {messageHistory.map((item) => {
              return (
                <div key={item.id} className="">
                  {item.role === "bot" && (
                    <div className="flex justify-end mr-3 mt-2 ml-[20%]">
                      <div
                        key={item.id}
                        className="m-0 p-2 bg-violet-600 rounded-md inline-block"
                      >
                        {item.message}
                      </div>
                    </div>
                  )}
                  {item.role != "bot" && (
                    <div className="flex justify-start ml-3 mt-2 mr-[20%]">
                      <div
                        key={item.id}
                        className="m-0 p-2 bg-blue-600 rounded-md inline-block"
                      >
                        {item.message}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-end mr-3 mt-2 ml-[20%]">
                <div className="p-2 bg-violet-600 rounded-md inline-block">
                  loading...
                </div>
              </div>
            )}
            <div className="flex w-full mt-5 justify-center pr-[5%] pl-[5%]">
              <input
                id="chat-input"
                type="text"
                className="bg-zinc-700 w-full p-4 pt-4 pb-4 inline-block rounded-md focus:outline-none shadow-md"
                placeholder="Ask your question..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
