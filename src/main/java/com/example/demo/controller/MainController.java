package com.example.demo.controller;


import com.example.demo.entity.Customer;
import com.example.demo.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class MainController {

    @Autowired
    private CustomerService customerService;

    @RequestMapping(value = "/index", produces = "text/html")
    private String main() {
        return "index";
    }


    @GetMapping("/customers")
    @ResponseBody
    private List<Customer> getCustomerList() {
        return customerService.getCustomerList();
    }



}
