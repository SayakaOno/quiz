import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { startQuiz, nextStatus } from '../actions';
import history from '../history';

const ANSWERING = 'answering';

class Setting extends React.Component {
  renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className='ui error message'>
          <div className='header'>{error}</div>
        </div>
      );
    }
  };

  renderFormElement = ({ input, label, meta, options }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <select {...input}>
          <option>select</option>
          {options &&
            options.map(option => <option key={option}>{option}</option>)}
        </select>
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.startQuiz(formValues);
    this.props.nextStatus(ANSWERING);
    history.push('/practice');
  };

  render() {
    return this.props.quizzes &&
      this.props.category &&
      this.props.subCategory ? (
      <div className='ui container setting'>
        <h1>Setting</h1>
        <p className='info'>
          <i className='folder open icon' />{' '}
          <Link to='/'>{this.props.category.name}</Link>
          <i className='angle right icon' />
          {this.props.subCategory.name}{' '}
          <small>{`(${this.props.quizzes.length} quizzes) `}</small>
        </p>
        <form
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          className='ui form error'
        >
          {/* <Field
            name="level"
            label="level"
            options={[1, 2, 3]}
            component={this.renderFormElement}
          /> */}
          <Field
            name='order'
            label='order'
            options={['random', 'sequence']}
            component={this.renderFormElement}
          />
          {/* <Field
            name="filter"
            label="filter"
            options={["all questions", "incorrenct questions"]}
            component={this.renderFormElement}
          /> */}
          <Field
            name='duration'
            label='duration'
            options={['5 sec', '6 sec', '7 sec', '8 sec', '9 sec', '10 sec']}
            component={this.renderFormElement}
          />
          {/* <Field
            name="mode"
            label="mode"
            options={["Translating mode", "Answering mode"]}
            component={this.renderFormElement}
          /> */}
          <Field
            name='numberOfQuestions'
            label='number of quizzes'
            options={[...Array(this.props.quizzes.length).keys()].map(i => ++i)}
            component={this.renderFormElement}
          />
          <button className='button ui primary'>Start</button>
        </form>
      </div>
    ) : (
      <Redirect to={{ pathname: '/' }} />
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.level || formValues.level === 'select') {
    errors.level = 'You must choose level';
  }
  if (!formValues.order || formValues.order === 'select') {
    errors.order = 'You must choose order';
  }
  if (!formValues.filter || formValues.filter === 'select') {
    errors.filter = 'You must choose filter';
  }
  if (!formValues.duration || formValues.duration === 'select') {
    errors.duration = 'You must choose duration';
  }
  if (!formValues.mode || formValues.mode === 'select') {
    errors.mode = 'You must choose mode';
  }
  if (
    !formValues.numberOfQuestions ||
    formValues.numberOfQuestions === 'select'
  ) {
    errors.numberOfQuestions = 'You must choose number of questions';
  }
  // return errors;
};

const mapStateToProps = state => {
  return {
    quizzes: state.quizzes,
    category: state.selectedCategory,
    subCategory: state.selectedSubCategory
  };
};

const formWrapped = reduxForm({
  form: 'setting',
  validate
})(Setting);

export default connect(
  mapStateToProps,
  { startQuiz, nextStatus }
)(formWrapped);
