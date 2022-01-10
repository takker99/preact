import { Component, createElement, isValidElement } from "../../";
import { expect } from "chai";
import { isValidElementTests } from "./isValidElementTests";

isValidElementTests(expect, isValidElement, createElement, Component);
