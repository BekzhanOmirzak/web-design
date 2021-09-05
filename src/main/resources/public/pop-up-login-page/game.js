/*




*/


(function () {

    function Question(question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }

    Question.prototype.displayQuestion = function () {
        console.log(this.question)
        for (let i = 0; i < this.answers.length; i++) {
            console.log(i + ' : ' + this.answers[i]);
        }
    }

    Question.prototype.checkAnswer = function (answer, callBack) {
        var sc;
        if (answer === this.correct) {
            console.log("Correct answer")
            sc = callBack(true);
        } else {
            console.log("Wrong Answer,Try Again")
            sc = callBack(false);
        }
        this.displayScore(sc);
    }

    Question.prototype.displayScore = function (score) {
        console.log('Your current score is : ' + score);
    }


    var q1 = new Question(
        'Is JS coolest programming language?',
        ['Yes', 'No'],
        0
    )

    var q2 = new Question(
        'What is the name of this course\'s teacher\'s name?',
        ['Bekzhan', 'Beksultan', 'Aydana'],
        0
    )
    let q3 = new Question(
        'What does best describe coding?',
        ['Boring', 'Fun', 'Tedious', 'Hard'],
        1
    );
    const questions = [q1, q2, q3];

    function score() {
        var sc = 0;
        return function (correct) {
            if (correct) {
                sc++;
            }
            return sc;
        }
    }

    var keepScore = score();

    function nextQuestion() {


        const n = Math.floor(Math.random() * questions.length);

        questions[n].displayQuestion();

        var answer = (prompt('Please select the correct answer ?'));
        if (answer !== 'exit') {
            questions[n].checkAnswer(parseInt(answer), keepScore);
            nextQuestion();
        }
    }
    nextQuestion();
})();





































