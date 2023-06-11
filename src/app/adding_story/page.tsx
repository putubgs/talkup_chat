"use client";
import React, { useState, useEffect } from "react";
import { forbiddenWords } from "@/dummy/forbiddenWords";

type ListItem = { date: string; time: string };

function convertTo12Hour(timeStr: string): string {
  // Create a new Date object with today's date
  const time = new Date();

  // Set the hours and minutes of the date object using the time string
  time.setHours(Number(timeStr.split(":")[0]));
  time.setMinutes(Number(timeStr.split(":")[1]));

  // Use toLocaleTimeString to format the time in 12-hour format with AM/PM
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const AddStoryPage: React.FC = () => {
  const [serverResult, setServerResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storyLabel, setStoryLabel] = useState(false);
  const [list, setList] = useState<ListItem[]>([]);
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [minTime, setMinTime] = useState("00:00");
  const [isDirect, setIsDirect] = useState(false);
  const [storyValue, setStoryValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    let sanitizedValue = inputValue;
    forbiddenWords.forEach((word) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
      sanitizedValue = sanitizedValue.replace(regex, "*".repeat(word.length));
    });

    setStoryValue(sanitizedValue);
  };

  const today = new Date();
  const dateString = `${today.getFullYear()}-${(
    "0" +
    (today.getMonth() + 1)
  ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

  const currentHour = ("0" + today.getHours()).slice(-2);
  const currentMinute = ("0" + today.getMinutes()).slice(-2);
  const currentTime = `${currentHour}:${currentMinute}`;

  useEffect(() => {
    if (inputDate === dateString) {
      setMinTime(currentTime);
    } else {
      setMinTime("00:00");
    }
  }, [inputDate, dateString, currentTime]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if date and time inputs are filled
    if (!inputDate || !inputTime) {
      // If not, alert the user to fill the fields
      if (!inputDate) alert("Please enter a date.");
      if (!inputTime) alert("Please enter a time.");
      return;
    }

    // Find the date and time in the list
    const listItem = list.find(
      (item) => item.date === inputDate && item.time === inputTime
    );

    // Check if a time already exists in the list for the same date
    if (listItem) {
      alert("This date and time already exist in the list.");
      return;
    }

    // Add a new list item
    setList([...list, { date: inputDate, time: inputTime }]);
    setInputTime("");
  };

  const handleToggle = () => {
    setIsDirect(!isDirect);
  };

  const handleReset = () => {
    setInputDate("");
    setInputTime("");
    setIsDirect(false);
    setList([]);
    setStoryValue("");
  };

  const handleUpload = async () => {
    if (storyValue.length < 21) {
      alert("Your story must be more than 20 characters!");
      return;
    }

    const asteriskCount = storyValue.split("*").length - 1;
    if (asteriskCount > 1) {
      // Show a warning pop-up or perform any other action
      alert("Warning: Your story contained bad words, please be nice!");
      handleReset();
      return;
    } else {
      setShowModal(true);
      setLoading(true);
      const response = await fetch("/api/pythonAPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: storyValue }),
      });
      console.log("api run");
      const data = await response.json();

      const convertedSchedules = list.map((item) => ({
        date: item.date,
        time: convertTo12Hour(item.time),
      }));

      if (data.result != "Others") {
        setStoryLabel(true);
        const storyData = {
          storyType: isDirect ? "Direct" : "Scheduled",
          schedules: convertedSchedules,
          story: storyValue,
          category: data.result,
        };

        handleReset();

        console.log(storyData);
        setServerResult(data.result);
      } else {
        setStoryLabel(false);
        handleReset();
      }

      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServerResult(null);
  };

  const renderLoadingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        {loading ? (
          <>
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64 mb-4"></div>
            <h2 className="text-center text-gray-600">
              The AI is Reading, please wait!
            </h2>
          </>
        ) : (
          <>
            {storyLabel ? (
              <p className="text-center text-gray-600 text-xl mb-6 font-bold">
                Result: {serverResult}
              </p>
            ) : (
              <p className="text-center text-gray-600 text-xl mb-6 font-bold">
                Please specify the problem!
              </p>
            )}
            <button
              className="bg-[#0D90FF] p-2 pl-12 pr-12 rounded-xl text-white"
              onClick={handleCloseModal}
            >
              OK!
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="flex flex-col min-w-0 p-12">
      {showModal && renderLoadingModal()}
      <div className="w-full bg-[#F6FAFF] rounded-lg p-6 flex flex-col space-y-10">
        <div className="font-bold text-[#16A6B7] text-xl">Write Your Story</div>
        <div className="mt-4">
          <div className="flex items-center justify-left">
            <label
              htmlFor="toggleB"
              className="flex items-center cursor-pointer"
            >
              <div className="mr-3 text-gray-700 font-medium">Direct</div>
              <div className="relative">
                <input
                  id="toggleB"
                  type="checkbox"
                  className="hidden"
                  checked={isDirect}
                  onChange={handleToggle}
                />
                <div
                  className={`toggle__line w-10 h-4 rounded-full shadow-inner ${
                    isDirect ? "bg-[#0D90FF]" : "bg-gray-500"
                  }`}
                ></div>
                <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 top-[-0.25rem] transition"></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">Scheduled</div>
            </label>
          </div>
        </div>
        {isDirect && (
          <div>
            <label>Add Your Available Schedules</label>
            <form onSubmit={handleSubmit} className="mt-2">
              <input
                type="date"
                min={dateString}
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="mr-4 w-[250px] h-12 p-2 border rounded-lg"
              />
              <input
                type="time"
                min={minTime}
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="mr-4 w-[250px] h-12 p-2 border rounded-lg"
              />
              <button
                type="submit"
                className="p-1 pl-2 pr-2 bg-[#0D90FF] h-12 text-white rounded"
              >
                Add to List
              </button>
            </form>
            <div className="flex space-x-4 pt-6">
              {list.map((item, index) => (
                <div
                  key={index}
                  className="p-2 rounded-xl bg-[#0D90FF] text-white text-center w-[150px] text-xs"
                >
                  <div>
                    {item.date} {convertTo12Hour(item.time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="">
          <label>Story</label>
          <input
            className="mt-2 p-2 w-full h-12 border rounded-lg"
            maxLength={100}
            value={storyValue}
            onChange={handleInputChange}
          />
          <div
            className="pt-2"
            style={{
              color:
                storyValue.length === 0
                  ? "black"
                  : storyValue.length <= 20
                  ? "red"
                  : storyValue.length < 100
                  ? "green"
                  : "red",
            }}
          >
            {storyValue.length} / 100 Characters
          </div>
        </div>
      </div>
      <div className="flex space-x-6 justify-end pt-8">
        <button
          onClick={handleReset}
          className="border border-[#0D90FF] p-4 pl-10 pr-10 rounded-lg text-[#0D90FF]"
        >
          Reset
        </button>
        <button
          onClick={handleUpload}
          className="bg-[#0D90FF] p-4 pl-10 pr-10 rounded-lg text-white"
        >
          Upload Story
        </button>
      </div>
    </section>
  );
};

export default AddStoryPage;
