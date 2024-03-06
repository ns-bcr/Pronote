const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class PronoteEvaluationsCard extends LitElement {

    static get properties() {
        return {
            config: {},
            hass: {}
        };
    }

    getCardHeader() {
        let sensorName = this.config.entity;
        let child_attributes = this.hass.states[sensorName].attributes;
        let child_name = (typeof child_attributes['friendly_name'] === 'string' && child_attributes['friendly_name'].length > 0) ? child_attributes['friendly_name'] : sensorName.split('_')[0];
        return html`<div class="pronote-card-header">Évaluations de ${child_name}</div>`;
    }

    getEvaluationRow(evaluation) {
        let levelColor = '';
        switch (evaluation.level) {
            case 'A+':
                levelColor = 'darkgreen';
                break;
            case 'A':
                levelColor = 'green';
                break;
            case 'C':
                levelColor = 'yellow';
                break;
            case 'D':
                levelColor = 'red';
                break;
            default:
                levelColor = 'black';
        }

        return html`
        <tr>
            <td>${evaluation.date}</td>
            <td>${evaluation.subject}</td>
            <td style="color: ${levelColor};">${evaluation.level}</td>
            <td>${evaluation.name}</td>
        </tr>
        `;
    }

    render() {
        if (!this.config || !this.hass) {
            return html``;
        }

        const evaluations = this.hass.states[this.config.entity].attributes['evaluations'];

        if (evaluations) {
            const evaluationRows = evaluations.map(evaluation => this.getEvaluationRow(evaluation));

            return html`
                <ha-card id="${this.config.entity}-card">
                    ${this.config.display_header ? this.getCardHeader() : ''}
                    <table>
                        <tr>
                            <th>Date</th>
                            <th>Matière</th>
                            <th>Niveau</th>
                            <th>Évaluation</th>
                        </tr>
                        ${evaluationRows}
                    </table>
                </ha-card>`;
        }
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }

        const defaultConfig = {
            entity: null,
            display_header: true,
        };

        this.config = {
            ...defaultConfig,
            ...config
        };
    }

    static get styles() {
        return css`
        .pronote-card-header {
            text-align:center;
        }
        div {
            padding: 12px;
            font-weight:bold;
            font-size:1em;
        }
        table {
            font-size: 0.9em;
            font-family: Roboto;
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
        `;
    }
}

customElements.define("pronote-evaluations-card", PronoteEvaluationsCard);
