import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

export default function Experience() {
  return (
    <div className="mt-8 mb-3">
      <h2 className="font-semibold">Experience</h2>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            SWE <p className="text-gray-600 text-sm font-normal">KIM.CC</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            Founding Engineer{" "}
            <p className="text-gray-600 text-sm font-normal">Go CrossPay</p>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
