import React, { FC, useState } from "react";

interface SchedulePickerProps {
  storyType: string;
  schedules: Array<Schedule>;
  isProfile: boolean;
  onSelectedScheduleChange: (schedule: Schedule) => void;
}

type Schedule = {
  date: string;
  time: string;
};

const SchedulePicker: FC<SchedulePickerProps> = ({
  schedules,
  storyType,
  isProfile,
  onSelectedScheduleChange,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  return (
    <>
      {isProfile
        ? storyType == "Scheduled" && (
            <div>
              <hr />
              <div className="text-xs py-3 space-y-2">
                <div className="text-[13px]">Schedule:</div>
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="border border-1 p-2 rounded-xl border-[#0D90FF] text-[#0D90FF] text-center"
                  >
                    {schedule.time}, {schedule.date}
                  </div>
                ))}
              </div>
              <hr />
            </div>
          )
        : storyType === "Scheduled" && (
            <div>
              <hr />
              <div className="text-xs py-3 space-y-2">
                <div className="text-[13px]">Schedule:</div>
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      onSelectedScheduleChange(schedule);
                    }}
                    className={`border border-1 p-2 rounded-xl cursor-pointer ${
                      selectedSchedule === schedule
                        ? "bg-[#0D90FF] text-white"
                        : "border-[#0D90FF] text-[#0D90FF]"
                    } text-center`}
                  >
                    {schedule.time}, {schedule.date}
                  </div>
                ))}
              </div>
              <hr />
            </div>
          )}
    </>
  );
};

export default SchedulePicker;
