import glamorous from 'glamorous';
import React from 'react';
import {fetchData, loading, errorHandling} from '../FetchComponent/FetchData';
import R, {compose} from 'ramda';
import Rx from 'rx';
import Post from './Post';
import loaderSvg from '../../static/ring.svg';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import './animate.css';

export class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dataList: [], currentIndex: 0, currentStatus: 'NOOP'};
    this.newsFeed = null;
    this.fetchHackerItem = this.fetchHackerItem.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }
  handleMore() {
    const {postList} = this.props;
    const totalPosts = R.length(postList);
    this.setState({currentIndex: (this.state.currentIndex + 1) % totalPosts});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentIndex !== this.state.currentIndex)
      this.fetchHackerItem();
  }

  fetchHackerItem() {
    const {postList} = this.props;
    const {currentIndex} = this.state;
    const getIndex = R.curry((index, array) => array[index]);
    const getItems = R.compose(getIndex(currentIndex), R.splitEvery(20));
    const getUrl = R.map(
      item => `https://hacker-news.firebaseio.com/v0/item/${item}.json`,
    );
    const getPromiseList = R.map(item => fetch(item).then(res => res.json()));
    const promiseList = R.compose(getPromiseList, getUrl)(getItems(postList));
    this.setState({currentStatus: 'STARTING'});
    this.newsFeed = Rx.Observable
      .from(promiseList)
      .flatMap(x => Rx.Observable.fromPromise(x))
      .take(20)
      .scan(
        (acc, curr, index) => {
          return acc.concat(curr);
        },
        [],
      )
      .subscribe(
        item => {
          this.setState({dataList: item});
        },
        e => {
          console.error(e.stack, e.message);
        },
        () => {
          this.setState({currentStatus: 'COMPLETED'});
        },
      );
  }

  componentDidMount() {
    this.fetchHackerItem();
  }
  componentWillUnmount() {
    if (this.newsFeed) this.newsFeed.dispose();
  }
  render() {
    const {Div, H2} = glamorous;
    const {dataList} = this.state;
    const newMap = R.addIndex(R.map);
    const posts = R.compose(
      newMap((item, index) => (
        <CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
          transitionAppear={true}
          transitionAppearTimeout={500}
          key={index}
        >
          <Post postData={item} />
        </CSSTransitionGroup>
      )),
    );
    const CenteredImage = glamorous.img({
      margin: '0 auto',
      width: '10%',
      display: 'block',
    });
    return (
      <Div padding={20}>
        {posts(dataList)}
        {this.state.currentStatus === 'STARTING'
          ? <Div paddding={20}>
              <CenteredImage src={loaderSvg} />
              <H2 textAlign="center">Loading Data..</H2>
            </Div>
          : null}
        <Div paddingTop={10} cursor="pointer" onClick={this.handleMore}>
          More
        </Div>
      </Div>
    );
  }
}

// const PostList = props => {
//   const {Div} = glamorous;
//   const {postList} = props;
//   const newMap = R.addIndex(R.map);
//   const posts = R.compose(
//     R.take(10),
//     newMap((item, index) => (
//       <PostWithData
//         apiUrl={`https://hacker-news.firebaseio.com/v0/item/${item}.json`}
//         shouldUpdate={false}
//         key={index}
//       />
//     )),
//   );
//   return (
//     <Div padding={20}>
//       {posts(postList)}
//     </Div>
//   );
// };
//
export const PostListWithData = compose(
  fetchData('postList'),
  errorHandling(),
  loading('Loading..'),
)(PostList);
export default PostList;
