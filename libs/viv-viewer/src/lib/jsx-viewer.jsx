

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { JsxViewer } from './JsxViewer.jsx';
export class JsxViewerWebComponent extends HTMLElement {
  mountPoint;
  connectedCallback() {
    this.mountReactApp();
  }
  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.mountPoint);
  }
  mountReactApp() {
    if (!this.mountPoint) {
      this.mountPoint = document.createElement('div');
      this.appendChild(this.mountPoint);
    }
    // ReactDOM.render(React.createElement(JsxViewer), this.mountPoint)
    ReactDOM.render(<JsxViewer />, this.mountPoint);
  }
}
customElements.define('jsx-viewer', JsxViewerWebComponent);


// class VivViewerWebComponentWrapper extends HTMLElement {
//     constructor() {
//       super();
//       // Do something more
//     }
  
//     connectedCallback() {
//       const darkTheme = createMuiTheme({
//         palette: {
//           type: 'dark',
//           primary: grey,
//           secondary: grey,
//         },
//         props: {
//           MuiButtonBase: {
//             disableRipple: true,
//           },
//         },
//       });
  
//       function getRandomSource() {
//         return sources[Math.floor(Math.random() * sources.length)];
//       }
  
//       // https://reactrouter.com/web/example/query-parameters
//       function useQuery() {
//         return new URLSearchParams(useLocation().search);
//       }
  
//       function RoutedAvivator(props: any) {
//         const query = useQuery();
//         const url = query.get('image_url');
//         const {
//           routeProps: { history },
//         } = props;
//         if (url) {
//           const urlSrouce = {
//             urlOrFile: url,
//             description: getNameFromUrl(url),
//           };
//           return (
//             <ThemeProvider theme={darkTheme}>
//               <Avivator source={urlSrouce} history={history} />
//             </ThemeProvider>
//           );
//         }
//         const source = getRandomSource();
//         return (
//           <ThemeProvider theme={darkTheme}>
//             <Avivator source={source} history={history} isDemoImage />
//           </ThemeProvider>
//         );
//       }
  
//       // Create a ShadowDOM
//       //const root = this.attachShadow({ mode: 'open' });
  
//       // Create a mount element
//       const mountPoint = document.createElement('div');
  
//       this.appendChild(mountPoint);
  
//       ReactDOM.render(
//         <Router>
//           <Switch>
//             <Route
//               path="/"
//               render={(routeProps: any) => <RoutedAvivator routeProps={routeProps} />}
//             />
//           </Switch>
//         </Router>,
//         mountPoint
//       );
//     }
//   }
  
//   customElements.define(
//     'viv-viewer-web-component-wrapper',
//     VivViewerWebComponentWrapper
//   );
  