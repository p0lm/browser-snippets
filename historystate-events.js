/**
 * HistoryState Events.
 *
 * Provides a way to listen for history.pushState() / history.replaceState() events. Exposes 
 */
(() => {
  
  class HistoryStateEvent extends Event {
    constructor(change, state, title, url) {
      super(change, {
        bubbles: true,
        cancelable: true,
        composed: true
      });
      Object.defineProperties(this, {
        state: {
          value: state
        },
        title: {
          value: title
        },
        url: {
          value: url
        }
      });
    }
  };


  class ReplaceStateEvent extends HistoryStateEvent {
    constructor(state, title, url) {
      super('replacestate', state, title, url)
    }
  }


  class PushStateEvent extends HistoryStateEvent {
    constructor(state, title, url) {
      super('pushstate', state, title, url);
    }
  }


  const history = window.history;
  const _pushState = history._pushState = (history.__pushState || history.pushState);
  const _replaceState = history.__replaceState = (history.__replaceState || history.replaceState);

  history.pushState = function(...args) {
    if (window.dispatchEvent(new PushStateEvent(...args))) {
      return _pushState.apply(this, args);
    }
  }

  history.replaceState = function(...args) {
    if (window.dispatchEvent(new ReplaceStateEvent(...args))) {
      return _replaceState.apply(this, args);
    }
  }


  // Provide shorthand methods
  // * window.onpushstate 
  // * window.replacestate

  let _onpushstate = window.onpushstate;
  let _onreplacestate = window.onreplacestate;

  if (!Object.hasOwnProperty(window, 'onpushstate')) {
    Object.defineProperty(window, 'onpushstate', {
      configurable: true,
      enumerable: true,
      get: function onpushstate() {
        return _onpushstate
      },
      set: function onpushstate(fn) {
        window.removeEventListener('pushstate', _onpushstate);
        window.addEventListener('pushstate', _onpushstate = fn);
        return _onpushstate;
      }
    });
  }

  if (!Object.hasOwnProperty(window, 'onreplacestate')) {
    Object.defineProperty(window, 'onreplacestate', {
      configurable: true,
      enumerable: true,
      get: function onreplacestate() {
        return _onreplacestate
      },
      set: function onreplacestate(fn) {
        this.removeEventListener('replacestate', _onreplacestate);
        this.addEventListener('replacestate', _onreplacestate = fn);
        return _onreplacestate
      }
    });
  }

  if (_onpushstate) { window.onpushstate = _onpushstate; }
  if (_onreplacestate) { window.onreplacestate = _onreplacestate; }

})();
