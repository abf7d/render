import { store } from '../../../../state/state';

class OverlayMenuWebComponent extends HTMLElement {
  onHeatmapChanged(value: string) {
    store.setState({ heatmapId: value });
  }
  handleClick(arg: any) {
    store.setState({
      overlayVisibilities: {
        ...store.getState().overlayVisibilities,
        [arg.value]: arg.checked,
      },
    });
  }
  setHeatmapOpacity(value: number) {
    store.setState({ heatmapOpacity: value });
  }
  constructor() {
    super();
    store.subscribe((currentState: any, previousState: any) => {
      if (
        JSON.stringify(currentState.heatmapIds) !==
        JSON.stringify(previousState.heatmapIds)
      ) {
        const state = currentState;
        this.attachShadow({ mode: 'open' }).innerHTML = `
          <div
            style="padding:10px;margin-left:4px;margin-right:8px;margin-top:19px;"
          >
            <select
              class="form-select"
              style="margin-bottom: 19px;width:100%; font-size:16px;"
              onchange="this.getRootNode().host.onHeatmapChanged(this.options[this.selectedIndex].value)"
            >
              ${currentState.heatmapIds
                .map(
                  (item: any) =>
                    `<option value="${item.value}">${item.label}</option>`
                )
                .join('')}
            </select>
            ${Object.entries(state.overlayVisibilities)
              .map(
                ([key, value]) => `
                        <div class="form-check" style="margin-bottom: 8px;">
                            <input class="form-check-input" type="checkbox" ${
                              value ? 'checked' : ''
                            } value=${`"${key}"`} onclick="this.getRootNode().host.handleClick(this)">
                            <label class="form-check-label">
                                ${key}
                            </label>
                        </div>
                    `
              )
              .join('')}
            <div style="margin-bottom: 8px;margin-top:16px;">
              Heatmap opacity
            </div>
            <input
              style="width:100%;"
              type="range"
              min="0"
              max="1"
              value=${state.heatmapOpacity}
              step="0.01"
              oninput="this.getRootNode().host.setHeatmapOpacity(this.value)"
            />
          </div>
        `;
        store.setState({ heatmapId: currentState.heatmapIds[0].value });
      }
    });
  }
}
customElements.define('overlay-menu-web-component', OverlayMenuWebComponent);
