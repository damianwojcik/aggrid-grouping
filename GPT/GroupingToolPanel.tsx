import {
  Column,
  GridApi,
  IToolPanelComp,
  IToolPanelParams,
} from "ag-grid-community";

interface AggregationItem {
  id: string;
  name: string;
  func: string;
}

interface CustomToolPanelParams extends IToolPanelParams {
  groupByFields: string[];
  setGroupByFields: React.Dispatch<React.SetStateAction<string[]>>;
  aggregations: AggregationItem[];
  activeAggregations: Set<string>;
  setActiveAggregations: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;
  private params!: CustomToolPanelParams;

  init(params: CustomToolPanelParams): void {
    this.params = params;
    this.api = params.api;
    this.eGui = document.createElement("div");
    this.eGui.classList.add("wrapper");
    this.render();
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(): void {
    this.render();
  }

  private render(): void {
    const {
      groupByFields,
      setGroupByFields,
      activeAggregations,
      setActiveAggregations,
      aggregations,
    } = this.params;

    this.eGui.innerHTML = "";

    const allColumns = this.api.getColumns() || [];
    const groupableColumns = allColumns.filter((col) => {
      const colDef = col.getColDef() as any;
      return colDef.isGroupable === true;
    });

    if (groupableColumns.length === 0) {
      const msg = document.createElement("div");
      msg.classList.add("msg-no-columns");
      msg.textContent = "No groupable columns available";
      this.eGui.appendChild(msg);
      return;
    }

    const groupSection = document.createElement("div");
    groupSection.classList.add("section");

    const groupTitle = document.createElement("div");
    groupTitle.classList.add("section-title");

    const groupIcon = document.createElement("span");
    groupIcon.classList.add(
      "ag-icon",
      "ag-icon-group",
      "ag-column-drop-icon",
      "ag-column-drop-vertical-icon"
    );

    const groupLabel = document.createElement("span");
    groupLabel.textContent = "Row Groups";

    groupTitle.appendChild(groupIcon);
    groupTitle.appendChild(groupLabel);
    groupSection.appendChild(groupTitle);

    const groupContent = document.createElement("div");
    groupContent.classList.add("content");

    groupableColumns.forEach((col: Column) => {
      const colId = col.getColId();
      const colDef = col.getColDef();
      const isChecked = groupByFields.includes(colId);
      const disableUnchecked = groupByFields.length >= 3 && !isChecked;

      const label = document.createElement("label");
      label.classList.add("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = isChecked;
      checkbox.disabled = disableUnchecked;

      checkbox.addEventListener("change", () => {
        const updated = isChecked
          ? groupByFields.filter((f) => f !== colId)
          : groupByFields.length < 3
          ? [...groupByFields, colId]
          : groupByFields;
        setGroupByFields(updated);
      });

      label.appendChild(checkbox);
      label.append(document.createTextNode(" " + (colDef.headerName || colId)));
      groupContent.appendChild(label);
    });

    groupSection.appendChild(groupContent);

    this.eGui.appendChild(groupSection);

    if (groupByFields.length > 0) {
      const orderInfo = document.createElement("div");
      orderInfo.classList.add("group-order");

      const label = document.createElement("div");
      label.classList.add("group-order-label");
      label.textContent = "Grouping order:";

      const pillContainer = document.createElement("div");
      pillContainer.classList.add("pill-container");

      groupByFields.forEach((field, index) => {
        const pill = document.createElement("span");
        pill.classList.add("pill");
        pill.textContent = field;

        pillContainer.appendChild(pill);

        if (index < groupByFields.length - 1) {
          const arrow = document.createElement("span");
          arrow.classList.add("pill-arrow");
          arrow.textContent = "→";
          pillContainer.appendChild(arrow);
        }
      });

      orderInfo.appendChild(label);
      orderInfo.appendChild(pillContainer);
      groupSection.appendChild(orderInfo);
    }

    const aggSection = document.createElement("div");
    aggSection.classList.add("section");

    const aggTitle = document.createElement("div");
    aggTitle.classList.add("section-title");

    const aggIcon = document.createElement("span");
    aggIcon.classList.add(
      "ag-icon",
      "ag-icon-aggregation",
      "ag-column-drop-icon",
      "ag-column-drop-vertical-icon"
    );

    const aggLabelText = document.createElement("span");
    aggLabelText.textContent = "Aggregations";

    aggTitle.appendChild(aggIcon);
    aggTitle.appendChild(aggLabelText);
    aggSection.appendChild(aggTitle);

    const aggContent = document.createElement("div");
    aggContent.classList.add("content");

    aggregations.forEach((agg) => {
      const aggLabel = document.createElement("label");
      aggLabel.classList.add("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = activeAggregations.has(agg.id);

      checkbox.addEventListener("change", () => {
        const newSet = new Set(activeAggregations);
        if (newSet.has(agg.id)) {
          newSet.delete(agg.id);
        } else {
          newSet.add(agg.id);
        }
        setActiveAggregations(newSet);
      });

      aggLabel.appendChild(checkbox);
      aggLabel.append(document.createTextNode(" " + agg.name));
      aggContent.appendChild(aggLabel);
    });

    aggSection.appendChild(aggContent);
    this.eGui.appendChild(aggSection);
  }
}
