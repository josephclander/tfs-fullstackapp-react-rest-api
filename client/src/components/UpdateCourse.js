import React, { Component } from 'react';
import ErrorsDisplay from './ErrorsDisplay';
import Data from '../Data';

class UpdateCourse extends Component {
  state = {
    id: 0,
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: 0,
    User: {
      id: 0,
      firstName: '',
      lastName: '',
      emailAddress: '',
    },
    errors: [],
  };

  constructor() {
    super();
    this.data = new Data();
  }

  componentDidMount() {
    const courseId = this.props.match.params.id;
    const fetch = async () => {
      try {
        const response = await this.data.getCourseById(courseId);
        this.setState(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
    document.title = `Course Update`;
  }

  render() {
    const { title, description, estimatedTime, materialsNeeded, User, errors } =
      this.state;
    const { firstName, lastName } = User;

    return (
      <main>
        <div className='wrap'>
          <h2>Update Course</h2>
          <ErrorsDisplay errors={errors} />
          <form onSubmit={this.handleSubmit}>
            <div className='main--flex'>
              <div>
                <label htmlFor='courseTitle'>Course Title</label>
                <input
                  id='title'
                  name='title'
                  type='text'
                  value={title}
                  onChange={this.handleChange}
                />

                <p>
                  By {firstName} {lastName}
                </p>

                <label htmlFor='description'>Course Description</label>
                <textarea
                  id='description'
                  name='description'
                  value={description}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <label htmlFor='estimatedTime'>Estimated Time</label>
                <input
                  id='estimatedTime'
                  name='estimatedTime'
                  type='text'
                  value={estimatedTime}
                  onChange={this.handleChange}
                />

                <label htmlFor='materialsNeeded'>Materials Needed</label>
                <textarea
                  id='materialsNeeded'
                  name='materialsNeeded'
                  value={materialsNeeded}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <button className='button' type='submit'>
              Update Course
            </button>
            <button
              className='button button-secondary'
              onClick={this.handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      </main>
    );
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { context } = this.props;
    const { id, title, description, estimatedTime, materialsNeeded } =
      this.state;
    const userId = context.authenticatedUser.id;
    const { emailAddress } = context.authenticatedUser;
    const { password } = context.authenticatedUser;

    // Create course to update
    const course = {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    };

    context.data
      .updateCourse(course, emailAddress, password)
      .then((errors) => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          this.props.history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push('/');
      });
  };

  handleCancel = (event) => {
    event.preventDefault();
    this.props.history.push('/');
  };
}

export default UpdateCourse;
