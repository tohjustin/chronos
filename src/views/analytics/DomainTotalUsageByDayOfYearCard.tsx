import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";

import Card from "../../components/Card";

const DomainTotalUsageByDayOfYearCard = () => (
  <Card
    className="analytics-view__card analytics-view__card--lg"
    title="Usage this year"
    description="Total time spent on each day so far"
    body={
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveCalendar
          data={[
            { day: "2019-01-04", value: 110 },
            { day: "2019-01-08", value: 383 },
            { day: "2019-01-09", value: 70 },
            { day: "2019-01-12", value: 87 },
            { day: "2019-01-25", value: 66 },
            { day: "2019-01-28", value: 169 },
            { day: "2019-01-29", value: 243 },
            { day: "2019-01-30", value: 146 },
            { day: "2019-02-12", value: 12 },
            { day: "2019-02-24", value: 371 },
            { day: "2019-03-10", value: 389 },
            { day: "2019-03-19", value: 344 },
            { day: "2019-04-01", value: 338 },
            { day: "2019-04-16", value: 73 },
            { day: "2019-05-09", value: 174 }
          ]}
          from="2019-01-02"
          to="2019-08-05"
          emptyColor="#eeeeee"
          colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
          margin={{ top: 16, right: 16, bottom: 32, left: 32 }}
          monthBorderColor="#ffffff"
          monthLegendOffset={10}
          daySpacing={4}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: "transparent",
                  strokeWidth: 1
                }
              },
              ticks: {
                line: {
                  stroke: "#f00",
                  strokeWidth: 1
                },
                text: {
                  fontSize: 33
                }
              },
              legend: {
                text: {
                  fontSize: 33
                }
              }
            },
            labels: {
              text: {
                fill: "#8da2b5",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily:
                  '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
              }
            },
            tooltip: {
              container: {
                background: "#244360",
                color: "#fff",
                fontSize: "inherit",
                borderRadius: "2px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
                padding: "5px 9px"
              },
              basic: {
                whiteSpace: "pre",
                display: "flex",
                alignItems: "center"
              },
              chip: {
                marginRight: 7
              },
              table: {},
              tableCell: {
                padding: "3px 5px"
              }
            }
          }}
          dayBorderColor="#ffffff"
          // legends={[
          //   {
          //     anchor: "top-left",
          //     direction: "row",
          //     translateY: 36,
          //     itemCount: 4,
          //     itemWidth: 34,
          //     itemHeight: 36,
          //     itemDirection: "top-to-bottom"
          //   }
          // ]}
        />
      </div>
    }
  />
);

export default DomainTotalUsageByDayOfYearCard;
