package org.sareekala.backend.service;

import org.sareekala.backend.dao.RoleDao;
import org.sareekala.backend.dao.UserDao;
import org.sareekala.backend.entity.Role;
import org.sareekala.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private RoleDao roleDao;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.firstname:Admin}")
    private String adminFirstName;

    @Value("${admin.lastname:Admin}")
    private String adminLastName;

    public User registerNewUser(User user) {
        Role role = roleDao.findById("User").orElseThrow(() -> new RuntimeException("User role not found"));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRole(roles);
        user.setUserPassword(getEncodedPassword(user.getUserPassword()));
        return userDao.save(user);
    }

    public void initRolesAndUsers() {
        Role adminRole = new Role();
        adminRole.setRoleName("Admin");
        adminRole.setRoleDescription("Admin role");
        roleDao.save(adminRole);

        Role userRole = new Role();
        userRole.setRoleName("User");
        userRole.setRoleDescription("Default User role");
        roleDao.save(userRole);

        Optional<User> existingAdmin = userDao.findByUserName(adminUsername);
        if (existingAdmin.isEmpty()) {
            User adminUser = new User();
            adminUser.setUserFirstName(adminFirstName);
            adminUser.setUserLastName(adminLastName);
            adminUser.setUserName(adminUsername);
            adminUser.setUserPassword(getEncodedPassword(adminPassword));

            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            adminUser.setRole(adminRoles);

            userDao.save(adminUser);
        }
    }

    public String getEncodedPassword(String password) {
        return passwordEncoder.encode(password);
    }
}
