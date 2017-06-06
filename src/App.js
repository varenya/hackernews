import React, {Component} from 'react';
import {PostListWithData} from './components/post';
import {Route} from 'react-router-dom';
import NavBar from './components/navbar';
import glamorous from 'glamorous';
import './App.css';

console.log(PostListWithData);
const Wrapper = glamorous.div((props, theme) => ({
  fontFamily: theme.fontFamily,
  backgroundColor: theme.primaryColor,
}));

const getUrl = selectedOption => {
  if (selectedOption === 'new') {
    return 'https://hacker-news.firebaseio.com/v0/newstories.json';
  } else if (selectedOption === 'show') {
    return 'https://hacker-news.firebaseio.com/v0/showstories.json';
  } else if (selectedOption === 'ask') {
    return 'https://hacker-news.firebaseio.com/v0/askstories.json';
  } else if (selectedOption === 'jobs') {
    return 'https://hacker-news.firebaseio.com/v0/jobstories.json';
  } else {
    return 'https://hacker-news.firebaseio.com/v0/newstories.json';
  }
};

class App extends Component {
  render() {
    const {H1} = glamorous;
    return (
      <Wrapper>
        <H1 textAlign="center" marginBottom={30} paddingTop={30}>
          Hacker News
        </H1>
        <NavBar navItems={['new', 'show', 'ask', 'jobs']} />
        <Route
          path="/"
          render={() => (
            <PostListWithData
              apiUrl="https://hacker-news.firebaseio.com/v0/newstories.json"
            />
          )}
          exact={true}
        />
        <Route
          path="/:selectedOption"
          render={({match: {params}}) => {
            return <PostListWithData apiUrl={getUrl(params.selectedOption)} />;
          }}
        />
      </Wrapper>
    );
  }
}

export default App;
