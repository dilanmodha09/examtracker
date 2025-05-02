# Exam Tracker PWA

A modern web application designed for students to track their exam dates, manage revision sessions, and import exam timetables. This Progressive Web App (PWA) works seamlessly across both web and mobile platforms, offering a clean, intuitive interface with pastel colors and dark/light mode options.

## Core Features

- **Next Exam Countdown**: Displays the date, time, and seat number of the user's next exam.
- **Exam List**: View a list of all exams, with the ability to mark exams as completed or upcoming.
- **Revision Session Planner**: Plan and track study sessions for each exam with a topic management feature.
- **JSON Import**: Allows users to import their exam timetable in JSON format.
- **Custom Theming**: Select from pastel color schemes and toggle between light and dark modes.
- **Progressive Web App (PWA)**: Ensures offline functionality and app-like experience on mobile.
- **Data Persistence**: Local storage ensures user data remains persistent across sessions.

## Design Elements

- Clean, minimalist UI with ample white space and clear hierarchy.
- Pastel color palette with customizable theme options.
- Responsive layout, adapting seamlessly from mobile to desktop.
- Intuitive tab navigation with a bottom navigation bar.
- High-contrast text for readability in all theme modes.
- Smooth animations for tab transitions and interactive elements.
- Card-based design for better information hierarchy.

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **PWA**: vite-plugin-pwa
- **UI**: Tailwind CSS
- **State Management**: React Context API or Redux
- **JSON Data**: Support for importing exam timetable JSON

## How to Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/exam-tracker-pwa.git
    cd exam-tracker-pwa
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and go to `http://localhost:3000` to see the app in action.

## Key Components

- **NextExam Component**: Displays the next upcoming exam and its details (name, time, seat number).
- **JsonUploader Component**: Allows users to upload their exam timetable in JSON format.
- **Exams Tab**: Lists all exams and allows users to track completed and upcoming exams.
- **Revision Tab**: Allows students to plan and manage their revision sessions.

## Importing Exam Timetable

To import your exam timetable:

You can use ChatGPT or an alternative to convert your timetable into our generic format. You can tell your AI to give it in the layout we provided by copy and pasting my example.

1. Click the **Import** button (available on the Next Exam screen or Exams tab).
2. Paste your exam timetable JSON or upload a JSON file.

Example JSON format:

```json
{
  "candidate": {
    "name": "John Smith",
    "number": "1234",
    "year": "11",
    "regGroup": "11R",
    "season": "Summer 2025"
  },
  "exams": [
    {
      "date": "Thu 08/05/2025",
      "start": "13:00",
      "duration": "0h 45m",
      "board": "AQA",
      "level": "GCSE/9FC",
      "element": "8668H: German Tier H",
      "component": "8668/LH: German Listening Test Tier H",
      "room": "STEM - Conference room",
      "seat": "I7"
    }
  ]
}
