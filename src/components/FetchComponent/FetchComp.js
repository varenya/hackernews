import React, {Component} from 'react';
import glamorous from 'glamorous';
import {getDisplayName, makeCancelable} from '../../utils';

const Error = glamorous.h1({color: '#c0392b'});

export const fetchMap = {
  initiate: 'INITIATE',
  complete: 'COMPLETE',
  error: 'ERROR',
  noop: 'NOOP',
};

const fetchComponent = keyName =>
  BaseComponent => {
    class FetchComponent extends Component {
      constructor(props) {
        super(props);
        this.state = {currentStatus: fetchMap.noop, error: '', data: []};
        this.fetchApi = this.fetchApi.bind(this);
        this.fetchPromise = null;
        this._isMounted = null;
      }
      fetchApi(apiUrl) {
        // console.log(getDisplayName(BaseComponent),"fetchApi");
        this.setState({currentStatus: fetchMap.initiate, error: ''});
        this.fetchPromise = makeCancelable(fetch(apiUrl));
        this.fetchPromise.promise
          .then(res => res.json())
          .then(data => {
            if (!this._isMounted) return;

            this.setState({data, currentStatus: fetchMap.complete});
          })
          .catch(e => {
            if (e.isCanceled) return;
            this.setState({error: e.message, currentStatus: fetchMap.error});
          });
      }
      componentWillReceiveProps(nextProps) {
        if (this.props.apiUrl !== nextProps.apiUrl) {
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
        this.fetchPromise.cancel();
      }
      render() {
        const {data, error, currentStatus} = this.state;
        const {apiUrl, ...baseProps} = this.props;
        switch (currentStatus) {
          case fetchMap.noop:
            return <div>Iniital Render...</div>;
          case fetchMap.initiate:
            return <div> Loading ...</div>;
          case fetchMap.error:
            return <Error>{error}</Error>;
          case fetchMap.complete:
            return <BaseComponent {...{[keyName]: data}} {...baseProps} />;
          default:
            return <div>Iniital Render..</div>;

        }
      }
    }

    FetchComponent.displayName = `FetchComponent(${getDisplayName(BaseComponent)})`;

    return FetchComponent;
  };

export default fetchComponent;
