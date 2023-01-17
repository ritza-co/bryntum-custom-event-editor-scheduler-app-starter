import { Scheduler, StringHelper, SlideToggle } from "@bryntum/scheduler";
import "@bryntum/scheduler/scheduler.stockholm.css";
import MeetingBookingModel from "./lib/MeetingBookingModel";

const eventTypeColors = {
  meeting: "indigo",
  internal: "purple",
  appointment: "red",
};

const slideToggle = new SlideToggle({
  name: "laptopNeeded",
  label: "Laptop needed?",
  color: "b-blue",
  labelPosition: "before",
  cls: "laptopNeeded",
});

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
  enableRecurringEvents: true,

  features: {
    // Customize the event editor
    eventEdit: {
      editorConfig: {
        autoUpdateRecord: true,
        defaults: {
          // can be "before" (default) or "above"
          labelPosition: "above",
        },
      },
      items: {
        nameField: {
          label: "Meeting title",
        },
        resourceField: {
          label: "Room",
        },
        startDateField: {
          labelPosition: "before",
          id: "startDateField",
        },
        endDateField: {
          labelPosition: "before",
          id: "endDateField",
        },
        organizersField: {
          type: "combo",
          label: "organizers",
          name: "organizers",
          multiSelect: true,
          weight: 210,
          items: [
            "Peter Johnson",
            "Francis Roux",
            "Jeffrey Marks",
            "Joyce Hill",
            "Bryce Jones",
          ],
          required: "true",
        },
        attendeesField: {
          type: "number",
          name: "attendees",
          label: "Number of attendees",
          labelCls: "label-padding",
          required: true,
          min: 1,
          max: 20,
        },
        eventTypeField: {
          type: "radiogroup",
          name: "eventType",
          label: "Meeting Type",
          labelPosition: "before",
          weight: 110, // Provided items start at 100, and go up in 100s, so insert after first one
          value: "meeting", // the default choice
          id: "eventTypeField",
          items: [
            {
              type: "radio",
              color: `b-${eventTypeColors["meeting"]}`,
              name: "eventType",
              text: "Meeting",
              checkedValue: "meeting",
              checked: true,
            },
            {
              type: "radio",
              color: `b-${eventTypeColors["internal"]}`,
              name: "eventType",
              text: "Internal",
              checkedValue: "internal",
            },
            {
              type: "radio",
              color: `b-${eventTypeColors["appointment"]}`,

              name: "eventType",
              text: "Appointment",
              checkedValue: "appointment",
            },
          ],
        },
        notesField: {
          type: "textarea",
          name: "notes",
          label: "Notes",
          labelCls: "label-padding",
          resize: "vertical",
        },
        customDivider: {
          html: "",
          dataset: {
            text: "Equipment",
          },
          cls: "b-divider",
          flex: "1 0 100%",
        },
        projectorNeededField: {
          type: "checkbox",
          name: "projectorNeeded",
          label: "Projector needed?",
          labelPosition: "before",
        },
        laptopNeededField: slideToggle,
      },
    },
  },

  crudManager: {
    autoLoad: true,
    loadUrl: "data/data-recurring.json",
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

  onBeforeEventEditShow({ eventEdit, resourceRecord }) {
    eventEdit.attendeesField.max = resourceRecord.data.capacity;
  },
  eventRenderer({ renderData, eventRecord }) {
    renderData.iconCls = eventRecord.isRecurring ? "b-fa b-fa-sync" : "";
    // change event bar color based on meeting type
    const { eventType } = eventRecord.data;
    renderData.eventColor = eventTypeColors[eventType];
    return StringHelper.xss`${eventRecord.name}`;
  },
});