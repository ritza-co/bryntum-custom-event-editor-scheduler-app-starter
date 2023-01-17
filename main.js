import { Scheduler, StringHelper } from "@bryntum/scheduler";
import "@bryntum/scheduler/scheduler.stockholm.css";
import MeetingBookingModel from "./lib/MeetingBookingModel";

const scheduler = new Scheduler({
  appendTo: document.body,
  startDate: new Date(2023, 0, 9, 8),
  endDate: new Date(2023, 0, 11, 18),
  viewPreset: {
    base: "hourAndDay",
    tickWidth: 100,
    headers: [
      {
        unit: "day",
        // use different date format for top header
        dateFormat: " ddd DD.MM.YYYY",
      },
      {
        unit: "hour",
        dateFormat: "LT",
      },
    ],
  },
  resourceImagePath: "resources/",

  crudManager: {
    autoLoad: true,
    loadUrl: "data/data.json",
    eventStore: {
      modelClass: MeetingBookingModel,
    },
  },

  columns: [
    {
      type: "resourceInfo",
      text: "Room name",
      width: 210,
      showMeta: (room) => StringHelper.xss`Max ${room.capacity} people`,
    },
  ],
});
