# Quiz App

A responsive and interactive quiz application built with HTML, CSS, and JavaScript. This app allows users to test their knowledge, practice various questions, and receive feedback on their answers.

## Features

- **Customizable Quiz Length**: Users can choose the number of questions they want to answer.
- **Randomized Questions**: Questions are selected randomly from the pool.
- **Shuffled Answers**: The order of answers is randomized to prevent memorization of positions.
- **Review Correct Answers**: Users can review the correct answer after selecting their choice.
- **Next Button Navigation**: Allows users to move to the next question only when they are ready.
- **Final Score Display**: Displays the number of correct and incorrect answers at the end of the quiz.

## Technologies Used

- **HTML**: Structuring the application layout.
- **CSS**: Styling and responsive design.
- **JavaScript**: Core logic for quiz functionality and dynamic behavior.

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/quiz-app.git
   ```

2. Navigate to the project folder:
   ```bash
   cd quiz-app
   ```

3. Open the `index.html` file in your browser.

## Project Structure

```
quiz-app/
├── index.html         # Main HTML file
├── style.css          # Stylesheet for the application
├── script.js          # JavaScript logic
├── questions.json     # JSON file containing quiz questions
└── README.md          # Project README file
```

## Customization

### Adding Questions

1. Open the `questions.json` file.
2. Add new questions in the following format:
   ```json
   [
     {
       "question": "What does HTML stand for?",
       "options": [
         "Hyper Text Markup Language",
         "High Text Machine Language",
         "Hyper Tool Markup Language",
         "None of the above"
       ],
       "answer": 0
     }
   ]
   ```
   - `question`: The question text.
   - `options`: An array of answer choices.
   - `answer`: The index of the correct answer in the `options` array (0-based).

### Styling

To customize the appearance of the app, edit the `style.css` file. Adjust colors, fonts, and spacing as needed.

## License

This project is licensed under the MIT License. Feel free to use and modify it as you wish.

## Contributions

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## Acknowledgments

- Built with love for interactive learning and knowledge sharing.
- Inspired by the need for fun and effective learning tools.

