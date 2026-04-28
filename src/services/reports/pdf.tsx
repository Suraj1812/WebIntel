import React from "react";
import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { WebsiteReport } from "@/types/report";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#334155",
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
    padding: 12,
    border: "1 solid #cbd5e1",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },
  row: {
    marginBottom: 4,
  },
  scoreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  scoreCard: {
    width: "30%",
    padding: 10,
    border: "1 solid #cbd5e1",
    borderRadius: 12,
  },
});

export async function renderReportPdf(
  report: WebsiteReport,
  options?: { whiteLabel?: boolean },
) {
  const doc = (
    <Document title={`WebIntel AI - ${report.domain}`}>
      <Page size="A4" style={styles.page}>
        {!options?.whiteLabel && (
          <>
            <Text style={styles.title}>WebIntel AI</Text>
            <Text style={styles.subtitle}>Know Any Website Before Anyone Else.</Text>
          </>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Website overview</Text>
          <Text style={styles.row}>Domain: {report.domain}</Text>
          <Text style={styles.row}>Title: {report.overview.siteTitle}</Text>
          <Text style={styles.row}>Meta description: {report.overview.metaDescription}</Text>
          <Text style={styles.row}>Language: {report.overview.language || "Unknown"}</Text>
          <Text style={styles.row}>Country estimate: {report.overview.countryEstimate || "Unknown"}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scorecards</Text>
          <View style={styles.scoreGrid}>
            {Object.entries(report.scorecards).map(([label, value]) => (
              <View key={label} style={styles.scoreCard}>
                <Text>{label.toUpperCase()}</Text>
                <Text>{value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key business insights</Text>
          <Text style={styles.row}>{report.aiInsights.whatBusinessDoes}</Text>
          <Text style={styles.row}>Monetization: {report.aiInsights.monetizationModel}</Text>
          <Text style={styles.row}>Conversion: {report.aiInsights.conversionAssessment}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended improvements</Text>
          {report.aiInsights.improvements.map((item) => (
            <Text key={item} style={styles.row}>
              - {item}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  const instance = pdf(doc);
  return instance.toBuffer();
}
