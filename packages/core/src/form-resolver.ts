import type { Form, FormCategory } from "@pokedex/schema";

export function getDefaultForm(forms: Form[]): Form | undefined {
  return forms.find((f) => f.isDefault) ?? forms[0];
}

export function groupFormsByCategory(forms: Form[]): Partial<Record<FormCategory, Form[]>> {
  const groups: Partial<Record<FormCategory, Form[]>> = {};
  for (const form of forms) {
    const bucket = groups[form.category] ?? (groups[form.category] = []);
    bucket.push(form);
  }
  return groups;
}
