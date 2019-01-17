import React from "react";
import { connect } from "react-redux";
import history from "../history";
import {
  selectQuizes,
  nextQuiz,
  nextStatus,
  incorrectAnswer
} from "../actions";

const ANSWERING = "answering";
const SHOWING_ANSWER = "showing_answer";
const FINISHED = "finished";

class ShowQuiz extends React.Component {
  constructor(props) {
    super(props);

    this.card = React.createRef();
  }

  componentDidMount() {
    this.card.current.focus();
  }

  handleKeydown = e => {
    if (this.props.currentStatus === ANSWERING) {
      this.props.nextStatus(SHOWING_ANSWER);
    } else if (this.props.currentStatus === SHOWING_ANSWER) {
      if (e.key === "ArrowLeft") {
        this.props.incorrectAnswer(
          this.props.quizes[this.props.currentQuiz].id
        );
      }
      if (this.props.currentQuiz === this.props.quizes.length - 1) {
        this.props.nextStatus(FINISHED);
        history.push("/result");
      } else {
        this.props.nextStatus(ANSWERING);
        this.props.nextQuiz();
      }
    }
  };

  render() {
    return (
      <div
        ref={this.card}
        className="ui cards"
        onKeyDown={this.handleKeydown}
        tabIndex="0"
      >
        <div className="card">
          <div className="count">
            {this.props.currentQuiz + 1}/{this.props.quizes.length}
          </div>
          <div className="content">
            <div className="question">
              <div className="description">Translate this!</div>
              <div className="ui huge header">
                {this.props.quizes[this.props.currentQuiz].translation}
              </div>
            </div>
            <div className="answer">
              {this.props.currentStatus === SHOWING_ANSWER ? (
                <React.Fragment>
                  <div className="description">Answer:</div>
                  <div className="ui huge header">
                    {this.props.quizes[this.props.currentQuiz].answer}
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    quizes: state.quizes,
    currentQuiz: state.currentQuiz,
    currentStatus: state.status,
    incorrectAnswers: state.incorrectAnswers
  };
};

export default connect(
  mapStateToProps,
  { selectQuizes, nextStatus, nextQuiz, incorrectAnswer }
)(ShowQuiz);
