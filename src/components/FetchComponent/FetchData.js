import React, {Component} from 'react';
import {wrapDisplayName, makeCancelable} from '../../utils';
import glamorous from 'glamorous';
import {fetchMap as fetchStatus} from './FetchComp';
import loaderSvg from '../../static/ring.svg';

export const fetchData = keyName =>
  BaseComponent => {
    class FetchData extends Component {
      constructor(props) {
        super(props);
        this.state = {data: [], status: fetchStatus.noop, error: ''};
        this.fetchApi = this.fetchApi.bind(this);
        this._isMounted = null;
        this.fetchPromise = null;
      }
      fetchApi(apiUrl) {
        this.setState({data: [], status: fetchStatus.initiate});
        this.fetchPromise = makeCancelable(fetch(apiUrl));
        this.fetchPromise.promise
          .then(res => res.json())
          .then(data => {
            if (!this._isMounted) return;
            this.setState({data, status: fetchStatus.complete});
          })
          .catch(e => {
            if (e.isCanceled) return;
            console.error(e.stack, e.message);
            debugger;
            this.setState({error: e.message, status: fetchStatus.error});
          });
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.apiUrl !== this.props.apiUrl) {
          this.fetchApi(nextProps.apiUrl);
        }
      }
      componentDidMount() {
        const {apiUrl} = this.props;
        this._isMounted = true;
        this.fetchApi(apiUrl);
      }
      componentWillUnmount() {
        this._isMounted = false;
        console.log("canceling promise.....");
        if (this.fetchPromise) this.fetchPromise.cancel();
      }
      render() {
        const {apiUrl, ...baseProps} = this.props;
        const {data, status, error} = this.state;
        if (status === fetchStatus.noop) {
          return <div>Initial Render .. </div>;
        }
        return (
          <BaseComponent
            {...baseProps}
            {...{[keyName]: data}}
            status={status}
            error={error}
          />
        );
      }
    }

    FetchData.displayName = wrapDisplayName(BaseComponent, 'FetchData');
    return FetchData;
  };

export const loading = loadMessage =>
  BaseComponent => {
    const Loader = props => {
      const {status, ...baseProps} = props;
      const {Div, H1} = glamorous;
      const CenteredImage = glamorous.img({
        margin: '0 auto',
        width: '15%',
        display: 'block',
      });
      if (status === fetchStatus.initiate) {
        return (
          <Div paddding={20}>
            <CenteredImage src={loaderSvg} />
            <H1 textAlign="center">{loadMessage}</H1>
          </Div>
        );
      } else
        return <BaseComponent {...baseProps} status={status} />;
    };

    Loader.displayName = wrapDisplayName(BaseComponent, 'Loader');
    return Loader;
  };

export const errorHandling = () =>
  BaseComponent => {
    const Error = props => {
      const {error, status, ...baseProps} = props;
      const {Div, H1} = glamorous;
      if (status === fetchStatus.error) {
        return (
          <Div color="red">
            <H1 textAlign="center">{error}</H1>
          </Div>
        );
      } else {
        return <BaseComponent {...baseProps} status={status} error={error} />;
      }
    };
    Error.displayName = wrapDisplayName(BaseComponent, 'Error');
    return Error;
  };
