import { Component, createElement, isValidElement } from "preact";
import { isValidElementTests } from "../shared/isValidElementTests";

isValidElementTests(expect, isValidElement, createElement, Component);
