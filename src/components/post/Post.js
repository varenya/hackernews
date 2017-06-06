import React from 'react';
import glamorous from 'glamorous';
import R from 'ramda';
import {fetchComponent} from '../FetchComponent';
import {lighten, darken} from 'polished';

const GlamDiv = glamorous.div(
  {padding: 10, marginBottom: 10},
  (props, theme) => ({
    backgroundColor: lighten(0.1, theme.primaryColor),
    border: `3px solid ${darken(0.2, theme.primaryColor)}`,
    borderRadius: 20,
    color: theme.textColor,
  }),
);

const SubText = glamorous.div({
  display: 'inline-block',
  padding: 10,
  textAlign: 'left',
});

const Title = glamorous.h3({padding: 10, textAlign: 'left'});

const Post = props => {
  const {Div, A, Span} = glamorous;
  if(!props.postData){
        return <div>No Data Available</div>
  }
  const {postData: {score = 0, by, kids = [], url, title}} = props;
  const count = R.length(kids);
  return (
    <GlamDiv>
      <A href={url} textDecoration="none">
        <Title>{title}</Title>
      </A>
      <Div>
        <SubText>
          Upvotes : <Span fontWeight="bold">{score}</Span>
        </SubText>
        <SubText>
          By : <Span fontWeight="bold">{by}</Span>
        </SubText>
        <SubText>
          Comments : <Span fontWeight="bold">{count}</Span>
        </SubText>
      </Div>
    </GlamDiv>
  );
};

Post.defaultProps = {
  postData: {
    url: '#',
    score: 0,
    by: 'anonymous',
    kids: [],
  },
};
export const PostWithData = fetchComponent('postData')(Post);
export default Post;
