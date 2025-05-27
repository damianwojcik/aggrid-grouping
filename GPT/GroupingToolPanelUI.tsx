import React, { useMemo, useCallback } from "react";

interface AggregationItem {
    id: string;
    name: string;
    func: string;
}

type Props = {
    groupByFields: string[];
    setGroupByFields: (fields: string[]) => void;
    activeAggregations: Set<string>;
    setActiveAggregations: (set: Set<string>) => void;
    aggregations: AggregationItem[];
    groupableFields: string[];
};

export const CustomGroupingPanelUI: React.FC<Props> = ({
    groupByFields,
    setGroupByFields,
    activeAggregations,
    setActiveAggregations,
    aggregations,
    groupableFields,
}) => {
    const groupOrderLabel = useMemo(() => {
        return groupByFields.length > 0
            ? groupByFields.join(" → ")
            : "None";
    }, [groupByFields]);

    const handleGroupToggle = useCallback(
        (colId: string) => {
            const isChecked = groupByFields.includes(colId);
            const updated = isChecked
                ? groupByFields.filter((f) => f !== colId)
                : groupByFields.length < 3
                    ? [...groupByFields, colId]
                    : groupByFields;
            setGroupByFields(updated);
        },
        [groupByFields, setGroupByFields]
    );

    const handleAggToggle = useCallback(
        (id: string) => {
            const updated = new Set(activeAggregations);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            setActiveAggregations(updated);
        },
        [activeAggregations, setActiveAggregations]
    );

    return (
        <div className="wrapper">
            <div className="section">
                <div className="section-title">
                    <span className="section-icon">≡</span>
                    <span>Row Groups</span>
                </div>

                {groupableFields.length === 0 && (
                    <div className="msg-no-columns">No groupable columns available</div>
                )}

                {groupableFields.map(({ colId, headerName }) => {
                    const checked = groupByFields.includes(colId);
                    const disabled = groupByFields.length >= 3 && !checked;

                    return (
                        <label key={colId} className="label">
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
                                onChange={() => handleGroupToggle(colId)}
                            />
                            &nbsp;{headerName}
                        </label>
                    );
                })}


                <div className="group-order">
                    <strong>Grouping order:</strong>
                    <div className="pill-container">
                        {groupByFields.length > 0 ? (
                            groupByFields.map((field) => (
                                <span key={field} className="pill">
                                    {field}
                                </span>
                            ))
                        ) : (
                            <span className="pill pill-empty">None</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="section">
                <div className="section-title">
                    <span className="section-icon">∑</span>
                    <span>Aggregations</span>
                </div>

                {aggregations.map((agg) => {
                    const checked = activeAggregations.has(agg.id);
                    return (
                        <label key={agg.id} className="label">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleAggToggle(agg.id)}
                            />
                            &nbsp;{agg.name}
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
