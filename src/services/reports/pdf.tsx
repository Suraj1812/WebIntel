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
  const output = await (instance as unknown as { toBuffer: () => Promise<unknown> }).toBuffer();
  return normalizePdfOutput(output);
}

async function normalizePdfOutput(output: unknown) {
  if (output instanceof Uint8Array) {
    return output;
  }

  if (output instanceof ArrayBuffer) {
    return new Uint8Array(output);
  }

  if (output && typeof output === "object" && "getReader" in output) {
    const reader = (output as ReadableStream<Uint8Array>).getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        chunks.push(value);
      }
    }

    return concatChunks(chunks);
  }

  if (output && typeof output === "object" && Symbol.asyncIterator in output) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of output as AsyncIterable<Uint8Array | Buffer>) {
      chunks.push(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk));
    }

    return concatChunks(chunks);
  }

  const arrayBuffer = await new Response(output as BodyInit).arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

function concatChunks(chunks: Uint8Array[]) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  return merged;
}
