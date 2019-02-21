import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
/**
 * @description this is an IIFE function
 * @returns {object}
 */
const Decx = (() => {
  class Store {
    constructor(reducers) {
      this.state = {};
      this.prevState = {};
      this.listeners = [];
      this.reducers = reducers;
      this.dispatch({});
    }
    /**
     * @description it is a getter function
     * to fetch a state
     * @returns {object} state
     */
    getState() {
      return this.state;
    }
    /**
     * @description it is a getter function
     * to fetch a prevState
     * @returns {object}
     */
    getPrevState() {
      return this.prevState;
    }
    /**
     * @descprition it consumes an object and update state
     * @param {object} action
     */
    dispatch(action) {
      this.prevState = this.state;
      this.state = this.reducers(this.state, action);
      //rerender everytime this.state changes
      this.listeners.forEach(listener => listener());
    }
    /**
     * @description it pushes a function to listener array
     * @param {function} listener
     *
     */
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.reduce((acc, val) => {
          if (val.toString() !== listener.toString()) {
            acc.push(val);
          }
          return acc;
        }, []);
      };
    }
  }
  /**
   * @description global variable inside of Remobx for decorators to access store
   */
  let store;

  const combinereducers = reducers => {
    return (state, action) => {
      return Object.keys(reducers).reduce((acc, val) => {
        acc[val] = reducers[val](state[val], action);
        return acc;
      }, {});
    };
  };
  /**
   * @description it dispatches whatever function
   * @param {JSX.Element} target
   */
  const event = (target, key, descriptor) => {
    const originalFn = descriptor.initializer().bind(target);
    descriptor.initializer = () => (...args) => {
      const action = originalFn(...args);
      store.dispatch(action);
    };
    return descriptor;
  };
  /**
   * @description only connceted class could listen to Remobx
   * @param {array} arr
   */
  const connect = (arr = []) => {
    return target => {
      target._listen = arr;
      target._remobx = true;
    };
  };
  /**
   * @description listen and privide a entire state as parameter
   */
  const listen = (target, key, descriptor) => {
    const originalFn = descriptor.initializer().bind(target);
    descriptor.initializer = () => () => {
      const state = store.getState();
      /**
       * @param {object} state
       */
      return Object.keys(state).length > 0 ? originalFn(state) : originalFn({});
    };
    return descriptor;
  };
  /**
   * @description it dispatches a function after async call is complete
   * @function
   * @param {JSX.Element} target
   * @returns {function}
   */
  const eventAsync = (target, key, descriptor) => {
    const originalFn = descriptor.initializer().bind(target);
    descriptor.initializer = () => async (...args) => {
      const action = await originalFn(...args);
      store.dispatch(action);
    };
    return descriptor;
  };

  class DecxProvider extends Component {
    componentDidMount() {
      this.unsubscribe = this.props.store.subscribe(() => {
        this.forceUpdate();
      });
    }
    componentWillUnmount() {
      this.unsubscribe();
    }

    recursiveCloneChildren = children => {
      return React.Children.map(children, child => {
        //does not listen to anything => always rerender
        if (
          (Array.isArray(child.type._listen) &&
            child.type._listen.length === 0) ||
          !child.type._listen ||
          !Array.isArray(child.type._listen)
        ) {
          //listen to mobx and is a component
          if (child.type._remobx && React.isValidElement(child)) {
            const childProps = { store: this.props.store };
            const children = this.recursiveCloneChildren(child.props.children);
            if (Array.isArray(children)) {
              return React.cloneElement(
                child,
                { ...child.props, ...childProps },
                children
              );
            }
            return React.cloneElement(child, { ...child.props, ...childProps });
          }
        }
        //listening to something
        else {
          const store = this.props.store.getState();
          const prevStore = this.props.store.getPrevState();
          const listenArray = child.type._listen;
          let rerender = false;
          /**
           * @description it compares currentstore and prevStore
           * if there is a change, it rerender
           * @param {string} ele
           */
          listenArray.some(ele => {
            if (!isEqual(store[ele], prevStore[ele])) {
              rerender = true;
              return true;
            }
          });
          if (rerender && child.type._remobx && React.isValidElement(child)) {
            const childProps = { store: this.props.store };
            const children = this.recursiveCloneChildren(child.props.children);
            if (Array.isArray(children)) {
              return React.cloneElement(
                child,
                { ...child.props, ...childProps },
                children
              );
            }
            return React.cloneElement(child, { ...child.props, ...childProps });
          }
        }
        return child;
      });
    };
    render() {
      store = this.props.store;
      return (
        <Fragment>{this.recursiveCloneChildren(this.props.children)}</Fragment>
      );
    }
  }

  DecxProvider.propTypes = {
    store: PropTypes.object.isRequired,
  };
  /**
   * @param {Array<string>} props
   */
  const Enhance = PassedComponent => (props = []) => {
    class EnhanceComponent extends Component {
      /**
       * @description it compares currnet state and prevState
       * and if they are not equal it rerender
       */
      shouldComponentUpdate() {
        const current = store.getState();
        const prev = store.getPrevState();
        return props.some(value => {
          !isEqual(current[value], prev[value]);
          if (!isEqual(current[value], prev[value])) {
            return true;
          }
        });
      }
      render() {
        return <PassedComponent {...this.props} />;
      }
    }

    return EnhanceComponent;
  };

  Enhance.propTypes = {
    props: PropTypes.array,
  };
  /**
   * @description it returns all these specific stuff
   */
  return {
    Store,
    DecxProvider,
    eventAsync,
    event,
    listen,
    combinereducers,
    connect,
    enhance: Enhance,
  };
})();

export default Decx;
