import React, { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/home")
      .then((res) => res.json())
      .then(setUser);
    handleRefresh();

    return () => {};
  }, []);

  const handleRefresh = async () => {
    fetch("/query?type=open")
      .then((res) => res.json())
      .then((res) => {
        const convos = res.conversations;
        let conversationslist = [];

        for (const conv in convos) {
          conversationslist.push(convos[conv]);
        }

        setRequests(conversationslist);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      interaction: selectedOption,
      body: textareaValue,
    };

    try {
      const response = await fetch("/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Server Response:", result);
        await handleRefresh();
        setSelectedOption("");
        setTextareaValue("");
        setMessage("Sent successfully");
      } else {
        console.error("Error:", response.statusText);
        setMessage("Couldn't send message, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4">
      {/* User Account Information */}
      <header className="bg-green-500 text-white w-full max-w-2xl text-center py-3 rounded-lg shadow-md mb-4">
        <h1 className="text-xl font-bold">User Account</h1>
        <p className="text-lg">Name: {user.name ?? "Loading..."}</p>
        <p className="text-lg">Email: {user.email ?? "Loading..."}</p>
      </header>

      {/* Form Section */}
      <section className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">
          Submit Customer Service Request
        </h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          {/* Dropdown Menu */}
          <label className="flex flex-col">
            <span className="text-lg font-medium mb-1">Request Type:</span>
            <select
              className="border border-gray-300 rounded-lg p-2"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              required
            >
              <option value="">-- Choose an option --</option>
              <option value="general query">General Query</option>
              <option value="product feature query">
                Product Feature Query
              </option>
              <option value="product pricing query">
                Product Pricing Query
              </option>
              <option value="product feature implementation request">
                Product Feature Implementation Request
              </option>
            </select>
          </label>

          {/* Text Area */}
          <label className="flex flex-col">
            <span className="text-lg font-medium mb-1">Description:</span>
            <textarea
              className="border border-gray-300 rounded-lg p-2 min-h-[100px] outline-none"
              placeholder="Enter your response here..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            ></textarea>
          </label>

          <input
            type="button"
            className="bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition cursor-pointer"
            value={"Submit"}
            onClick={handleSubmit}
          />
        </form>
        <p className="text-sm px-3 py-2 text-center w-full">{message}</p>
      </section>

      {/* List Section */}
      <section className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex justify-between items-center mb-4">
          Requests sent by you
          <button
            className="bg-blue-500 text-base text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </h2>
        <ul className="list-none space-y-3">
          {requests.length !== 0 ? (
            requests.map((item, index) => (
              <li
                key={index}
                className="text-lg space-y-1 shadow-md px-4 py-2 rounded-md"
              >
                <div className="flex py-1">
                  <p className="text-xl font-black">
                    {item.title?.length === 0 ? "━" : item.title}
                  </p>
                  <p className="text-green-500 font-bold ml-auto">
                    {item.state}
                  </p>
                </div>
                <p className="mt-1">You have sent : </p>
                <p
                  className="font-semibold text-xl mr-2"
                  dangerouslySetInnerHTML={{ __html: item.source.body }}
                />
              </li>
            ))
          ) : (
            <p className="text-sm">No request sent till now</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default App;
