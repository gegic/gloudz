/***********************************************************************
 * Module:  User.java
 * Author:  Gegic
 * Purpose: Defines the Class User
 ***********************************************************************/
package model;

import cloud.App;
import com.google.gson.*;
import com.google.gson.annotations.Expose;

import javax.management.relation.Role;
import java.lang.reflect.Type;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

public class User{
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private UserRole role;

    private Organization organization;


    public String getEmail() {
        return email;
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", organization=" + organization +
                '}';
    }

    public User(String email, String password, String firstName, String lastName, UserRole role) {
        super();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization newOrganization) {
        if (this.organization == null || !this.organization.equals(newOrganization))
        {
            if (this.organization != null)
            {
                Organization oldOrganization = this.organization;
                this.organization = null;
                oldOrganization.removeUsers(this);
            }
            if (newOrganization != null)
            {
                this.organization = newOrganization;
                this.organization.addUsers(this);
            }
        }
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        result = prime * result + ((password == null) ? 0 : password.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        User other = (User) obj;
        if (email == null) {
            if (other.email != null)
                return false;
        } else if (!email.equals(other.email))
            return false;
        if (password == null) {
            if (other.password != null)
                return false;
        } else if (!password.equals(other.password))
            return false;
        return true;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPassword() {
        return password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public void setProperties(User newUser){
        this.email = newUser.getEmail();
        this.firstName = newUser.getFirstName();
        this.lastName = newUser.getLastName();
        this.password = newUser.getPassword();
        this.organization = newUser.getOrganization();
        this.role = newUser.getRole();
    }

}