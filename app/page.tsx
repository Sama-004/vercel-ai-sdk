"use client";
import { useChat } from "ai/react";
import { useEffect, useState, useRef } from "react";
import { FiSend, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export default function Chat() {
  const [feedbackState, setFeedbackState] = useState({});
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      initialMessages: [],
      api: "/api/chat", // Specify the API endpoint for chat
    });

  useEffect(() => {
    const fetchMessagesAndFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);

        // Fetch feedback
        const feedbackResponse = await fetch("/api/feedback");
        const feedbackData = await feedbackResponse.json();
        if (feedbackData) {
          const feedback = feedbackData.reduce((acc, item) => {
            acc[item.messageId] = item.feedback;
            return acc;
          }, {});
          setFeedbackState(feedback);
        }
      } catch (error) {
        console.error("Error fetching messages or feedback:", error);
        setMessages([]); // Set to empty array in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesAndFeedback();
  }, [setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFeedback = async (messageId, feedback) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, feedback }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
      setFeedbackState((prev) => ({
        ...prev,
        [messageId]: feedback,
      }));
      console.log(`Feedback ${feedback} submitted for message ${messageId}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Chatbot assignment</h1>
      </header>
      <div className="flex-grow overflow-auto px-4 py-6">
        {messages &&
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}>
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                {m.role === "ai" && (
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleFeedback(m.id, "like")}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
                        feedbackState[m.id] === "like"
                          ? "bg-green-500 text-white"
                          : "text-gray-500 hover:bg-green-100"
                      }`}>
                      {feedbackState[m.id] === "like" ? (
                        <FaThumbsUp size={18} />
                      ) : (
                        <FiThumbsUp size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleFeedback(m.id, "dislike")}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
                        feedbackState[m.id] === "dislike"
                          ? "bg-red-500 text-white"
                          : "text-gray-500 hover:bg-red-100"
                      }`}>
                      {feedbackState[m.id] === "dislike" ? (
                        <FaThumbsDown size={18} />
                      ) : (
                        <FiThumbsDown size={18} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            className="flex-grow p-2 mr-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FiSend size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

/*
("use client");
import { useChat } from "ai/react";
import { useEffect, useState, useRef } from "react";
import { FiSend, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export default function Chat() {
  const [feedbackState, setFeedbackState] = useState({});
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      initialMessages: [],
      api: "/api/chat", // Specify the API endpoint for chat
    });

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]); // Set to empty array in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [setMessages]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/feedback`);
        const data = await response.json();
        if (data) {
          const feedback = data.reduce((acc, item) => {
            acc[item.messageId] = item.feedback;
            return acc;
          }, {});
          setFeedbackState(feedback);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFeedback = async (messageId, feedback) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, feedback }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
      setFeedbackState((prev) => ({
        ...prev,
        [messageId]: feedback,
      }));
      console.log(`Feedback ${feedback} submitted for message ${messageId}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Chatbot assignment</h1>
      </header>
      <div className="flex-grow overflow-auto px-4 py-6">
        {messages &&
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}>
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                {m.role === "ai" && (
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleFeedback(m.id, "like")}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
                        feedbackState[m.id] === "like"
                          ? "bg-green-500 text-white"
                          : "text-gray-500 hover:bg-green-100"
                      }`}>
                      {feedbackState[m.id] === "like" ? (
                        <FaThumbsUp size={18} />
                      ) : (
                        <FiThumbsUp size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleFeedback(m.id, "dislike")}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
                        feedbackState[m.id] === "dislike"
                          ? "bg-red-500 text-white"
                          : "text-gray-500 hover:bg-red-100"
                      }`}>
                      {feedbackState[m.id] === "dislike" ? (
                        <FaThumbsDown size={18} />
                      ) : (
                        <FiThumbsDown size={18} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            className="flex-grow p-2 mr-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FiSend size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

// ("use client");
// import { useChat } from "ai/react";
// import { useEffect, useState, useRef } from "react";
// import { FiSend, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
// import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

// export default function Chat() {
//   const [feedbackState, setFeedbackState] = useState({});
//   const messagesEndRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const { messages, input, handleInputChange, handleSubmit, setMessages } =
//     useChat({
//       initialMessages: [],
//       api: "/api/chat", // Specify the API endpoint for chat
//     });

//   useEffect(() => {
//     const fetchMessages = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch("/api/chat");
//         if (!response.ok) {
//           throw new Error("Failed to fetch messages");
//         }
//         const data = await response.json();
//         // Ensure data is an array, if not, use an empty array
//         setMessages(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//         setMessages([]); // Set to empty array in case of error
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [setMessages]);

//   useEffect(() => {
//     async function fetchFeedback() {
//       try {
//         const response = await fetch(`/api/feedback`);
//         const data = await response.json();
//         if (data) setFeedbackState(data);
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//       }
//     }
//     fetchFeedback();
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleFeedback = async (messageId, feedback) => {
//     try {
//       const response = await fetch("/api/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ messageId, feedback }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to submit feedback");
//       }
//       setFeedbackState((prev) => ({
//         ...prev,
//         [messageId]: feedback,
//       }));
//       console.log(`Feedback ${feedback} submitted for message ${messageId}`);
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <header className="bg-blue-600 text-white py-4 px-6">
//         <h1 className="text-2xl font-bold">Chatbot assignment</h1>
//       </header>
//       <div className="flex-grow overflow-auto px-4 py-6">
//         {messages &&
//           messages.map((m) => (
//             <div
//               key={m.id}
//               className={`flex ${
//                 m.role === "user" ? "justify-end" : "justify-start"
//               } mb-4`}>
//               <div
//                 className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
//                   m.role === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-800"
//                 }`}>
//                 <p className="whitespace-pre-wrap break-words">{m.content}</p>
//                 {m.role === "assistant" && (
//                   <div className="mt-2 flex justify-end space-x-2">
//                     <button
//                       onClick={() => handleFeedback(m.id, "like")}
//                       className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
//                         feedbackState[m.id] === "like"
//                           ? "bg-green-500 text-white"
//                           : "text-gray-500 hover:bg-green-100"
//                       }`}>
//                       {feedbackState[m.id] === "like" ? (
//                         <FaThumbsUp size={18} />
//                       ) : (
//                         <FiThumbsUp size={18} />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => handleFeedback(m.id, "dislike")}
//                       className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
//                         feedbackState[m.id] === "dislike"
//                           ? "bg-red-500 text-white"
//                           : "text-gray-500 hover:bg-red-100"
//                       }`}>
//                       {feedbackState[m.id] === "dislike" ? (
//                         <FaThumbsDown size={18} />
//                       ) : (
//                         <FiThumbsDown size={18} />
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <footer className="bg-white border-t border-gray-200 px-4 py-4">
//         <form onSubmit={handleSubmit} className="flex items-center">
//           <input
//             className="flex-grow p-2 mr-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={input}
//             placeholder="Type your message..."
//             onChange={handleInputChange}
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <FiSend size={20} />
//           </button>
//         </form>
//       </footer>
//     </div>
//   );
// }

*/
