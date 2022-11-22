/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { useChannelsStore } from '../../../../viv-viewer/src/lib/Avivator/src/state.js';
import { useViewerStore } from '../../../../viv-viewer/src/lib/Avivator/src/state.js';

import './multi-range-slider-web-component';
import { COLOR_PALLETE } from '../../../../viv-viewer/src/lib/Avivator/src/constants.js';

import { store } from '../../../../state/state';

class ImageMenuWebComponent extends HTMLElement {
  viewerState: any;
  useChannelsStore: any;

  selectChannel(sliderIndex: number, channelIndex: number) {
    // @ts-ignore
    store
      .getState()
      .onSelectionChanges[sliderIndex]({
        target: { value: 'Channel ' + channelIndex },
      });
  }
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const pixelValuesContainer = shadow.appendChild(
      document.createElement('div')
    );
    pixelValuesContainer.style.position = 'absolute';
    pixelValuesContainer.style.zIndex = '-1';
    pixelValuesContainer.style.top = '2px';
    pixelValuesContainer.style.left = '15px';
    let numberOfChannels: number;
    useViewerStore.subscribe((currentState: any, previousState: any) => {
      if (
        JSON.stringify(currentState.pixelValues) !==
        JSON.stringify(previousState.pixelValues)
      ) {
        pixelValuesContainer.innerHTML = currentState.pixelValues
          .slice(0, numberOfChannels)
          .map((value: []) => `<div style="margin-top:91px;">${value}</div>`)
          .join('');
      }
    });

    const menuContainer = shadow.appendChild(document.createElement('div'));
    this.useChannelsStore = useChannelsStore;
    const colorOptions = COLOR_PALLETE.map((color: number[]) => [
      color.join(' '),
      color,
    ]);
    let initialized = false;
    let channelOptions: string[] = [];
    useChannelsStore.subscribe((currentState: any, previousState: any) => {
      this.viewerState = currentState;
      if (
        JSON.stringify(currentState.colors) !==
        JSON.stringify(previousState.colors)
      ) {
        numberOfChannels = currentState.colors.length;

        const render = () => {
          menuContainer.innerHTML = `
                        ${currentState.colors
                          .map(
                            (color: number[], index: number) => `
                            <div style="margin:10px;">
                                <input checked type="checkbox" onclick="this.getRootNode().host.viewerState.toggleIsOn(${index})">
                                <div style="display: inline-block; width:88%; position:relative; top:15px;"><multi-range-slider
                        color="rgb(${color.join()})"
                        min=${currentState.domains[index][0]}
                        max=${currentState.domains[index][1]}
                        value1=${currentState.contrastLimits[index][0]}
                        value2=${currentState.contrastLimits[index][1]}
                        oninput1="this.getRootNode().host.getRootNode().host.viewerState.setPropertiesForChannel(${index},{contrastLimits: [Number(this.value), this.getRootNode().host.getRootNode().host.useChannelsStore.getState().contrastLimits[${index}][1]]})"
                        oninput2="this.getRootNode().host.getRootNode().host.viewerState.setPropertiesForChannel(${index},{contrastLimits: [this.getRootNode().host.getRootNode().host.useChannelsStore.getState().contrastLimits[${index}][0], Number(this.value)]})"
                        ></multi-range-slider></div>
                                <span style="font-size:20px;" onclick="this.getRootNode().host.viewerState.removeChannel(${index});this.parentNode.remove();">X</span>
                               <div style="padding-top:10px">
                               <select style="width:30%;margin-left:110px;" onchange="this.getRootNode().host.selectChannel(${index}, this.selectedIndex)" class="form-select">
                                ${channelOptions.map(
                                  (channelOption, channelOptionIndex) => `
                                <option ${
                                  index === channelOptionIndex ? 'selected' : ''
                                }>${channelOptions[channelOptionIndex]}</option>
                                `
                                )}
                            </select>
                            <select style="width:30%;"
                            class="form-select"
                            onchange="this.getRootNode().host.viewerState.setPropertiesForChannel(${index},{colors: this.options[this.selectedIndex].value.split(',').map((color)=>Number(color))})"
                        >
                            ${colorOptions
                              .map(
                                (colorOption: any) =>
                                  `<option ${
                                    JSON.stringify(colorOption[1]) ===
                                    JSON.stringify(color)
                                      ? 'selected'
                                      : ''
                                  } value="${colorOption[1]}">${
                                    colorOption[0]
                                  }</option>`
                              )
                              .join('')}
                        </select>
                        </div>
                            </div>
                        `
                          )
                          .join('')}
                    `;
        };

        if (!initialized) {
          const unsubscribeViewerStore = useViewerStore.subscribe(
            (currentViewerStoreState: any, previousViewerStoreState: any) => {
              channelOptions = currentViewerStoreState.channelOptions;
              initialized = true;
              unsubscribeViewerStore();
              render();
            }
          );
        } else {
          render();
        }
      }
    });

    const addChannelButton = shadow.appendChild(
      document.createElement('button')
    );
    addChannelButton.style.marginLeft = '15px';
    addChannelButton.textContent = 'Add Channel';
    addChannelButton.onclick = () => {
      store.getState().handleChannelAdd();
    };
  }
}

customElements.define('image-menu-web-component', ImageMenuWebComponent);
